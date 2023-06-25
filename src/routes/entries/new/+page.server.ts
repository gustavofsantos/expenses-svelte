import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { db } from '$lib/db';
import { EntryType } from '@prisma/client';
import { z } from 'zod';

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
	const user = event.locals.user;
	if (!user) {
		throw redirect(302, '/login?message=You must be logged in to view this page');
	}

	const categories = await db.category.findMany({
		where: { userId: user.id },
	});

	return { categories };
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const value = Number(formData.get('value'));
		const description = formData.get('description');
		const date = (formData.get('date') as string) || undefined;
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

		const user = event.locals.user;
		const { id } = await db.entry.create({
			data: {
				description: description as string,
				value: value as number,
				date: new Date(date || new Date()),
				type: type?.toUpperCase() as EntryType,
				userId: user!.id,
				categories: {
					createMany: {
						data: categories.map((categoryId) => ({ categoryId }))
					}
				}
			}
		});

		throw redirect(302, `/entries/${id}`);
	}
};
