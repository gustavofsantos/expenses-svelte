import { CATEGORIES_FILE_PATH, ENTRIES_FILE_PATH } from '$env/static/private';
import { CategoriesRepository } from '$lib/categories-repository';
import { EntriesService } from '$lib/entries-service';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const UpdateEntrySchema = z.object({
	description: z.string().optional(),
	value: z.number().int().positive(),
	type: z.enum(['income', 'expense']),
	date: z.date()
});

const entriesService = new EntriesService(ENTRIES_FILE_PATH);
const categoriesRepo = new CategoriesRepository(CATEGORIES_FILE_PATH);

export const load: PageServerLoad = async (event) => {
	const entryId = event.params.slug;
	const entry = await entriesService.findById(entryId);
	if (!entry) throw fail(404);

	const categories = await categoriesRepo.findAll();

	return { entry: JSON.parse(JSON.stringify(entry)), categories };
};

export const actions: Actions = {
	update: async (event) => {
		const entryId = event.params.slug;
		const formData = await event.request.formData();
		const value = Number(formData.get('value'));
		const description = formData.get('description') as string;
		const date = formData.get('date') ? new Date(formData.get('date') as string) : undefined;
		const type = (formData.get('type') as string | undefined) || undefined;

		const validation = UpdateEntrySchema.safeParse({
			description,
			value,
			date,
			type
		});
		if (!validation.success) {
			return fail(400, {
				value,
				description,
				date,
				type,
				error: 'Invalid data',
				errors: validation.error.flatten()
			});
		}

		await entriesService.update(entryId, validation.data);

		throw redirect(302, `/`);
	},
	delete: async (event) => {
		const entryId = event.params.slug;
		await entriesService.delete(entryId);

		throw redirect(302, '/?message=Delete successfully');
	}
};
