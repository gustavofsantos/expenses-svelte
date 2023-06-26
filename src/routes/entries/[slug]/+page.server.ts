import { db } from '$lib/db';
import { EntryType } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const entryTypes = [EntryType.EXPENSE.toLowerCase(), EntryType.INCOME.toLowerCase()];

const NewEntrySchema = z.object({
	description: z.string().optional(),
	value: z.number().int().positive(),
	type: z
		.string()
		.refine((x) => entryTypes.includes(x))
		.optional(),
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	categories: z.array(z.string()).optional()
});

export const load: PageServerLoad = async (event) => {
	const entryId = event.params.slug;
	const entry = await db.entry.findFirst({
		where: { id: entryId, userId: event.locals.user!.id },
		include: {
			categories: {
				include: {
					category: true
				}
			}
		}
	});
	if (!entry) throw fail(404);

	const categories = await db.category.findMany({
		where: { userId: event.locals.user!.id }
	});

	return {
		categories,
		entry: {
			...entry,
			categories: entry.categories.map((category) => category.category.id)
		}
	};
};

export const actions: Actions = {
	update: async (event) => {
		const entryId = event.params.slug;
		const formData = await event.request.formData();
		const value = Number(formData.get('value'));
		const description = formData.get('description');
		const date = formData.get('date') || undefined;
		const type = (formData.get('type') as string | undefined) || undefined;
		const categories = formData.getAll('categories') as string[];

		const validation = NewEntrySchema.safeParse({
			description,
			value,
			date,
			type,
			categories
		});
		if (!validation.success) {
			return fail(400, {
				value,
				description,
				date,
				type,
				categories,
				error: 'Invalid data',
				errors: validation.error.flatten()
			});
		}

		const currentEntry = await db.entry.findUnique({
			where: { id: entryId },
			include: {
				categories: {
					include: {
						category: true
					}
				}
			}
		});

		const categoriesToAdd = categories.filter(
			(category) =>
				!currentEntry?.categories.find((entryCategory) => entryCategory.category.id === category)
		);
		const categoriesToRemove = currentEntry?.categories
			.filter((entryCategory) => !categories.includes(entryCategory.category.id))
			.map((c) => c.categoryId);

		await db.$transaction([
			db.entry.updateMany({
				where: { id: entryId, userId: event.locals.user!.id },
				data: {
					value,
					description: description as string,
					date: date ? new Date(date as string) : undefined,
					type: type?.toUpperCase() as EntryType
				}
			}),
			db.categoryOnEntry.createMany({
				data: categoriesToAdd.map((category) => ({ categoryId: category, entryId }))
			}),
			db.categoryOnEntry.deleteMany({
				where: {
					entryId,
					categoryId: {
						in: categoriesToRemove
					}
				}
			})
		]);

		const entry = await db.entry.findFirst({
			where: { id: entryId, userId: event.locals.user!.id },
			include: {
				categories: {
					include: {
						category: true
					}
				}
			}
		});

    throw redirect(302, `/`);
	},
	delete: async (event) => {
		const entryId = event.params.slug;
		await db.entry.deleteMany({
			where: { id: entryId, userId: event.locals.user!.id }
		});

		throw redirect(302, '/?message=Delete successfully');
	}
};
