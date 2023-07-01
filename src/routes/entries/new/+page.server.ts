import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { z } from 'zod';
import { EntriesService } from '$lib/entries-service';
import { ENTRIES_FILE_PATH } from '$env/static/private';

const NewEntrySchema = z.object({
	description: z.string().optional(),
	value: z.number().int().positive(),
	type: z.enum(['income', 'expense']).optional().default('expense'),
	date: z
		.date()
		.optional()
		.default(() => new Date())
});

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const value = Number(formData.get('value'));
		const description = formData.get('description');
		const date = new Date((formData.get('date') as string) || Date.now());
		const type = (formData.get('type') as string | undefined) || undefined;

		const validation = NewEntrySchema.safeParse({
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

		const entriesService = new EntriesService(ENTRIES_FILE_PATH);
		const entry = await entriesService.create(validation.data);

		throw redirect(302, `/entries/${entry.id}`);
	}
};
