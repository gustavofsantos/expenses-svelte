import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

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
		.optional()
});

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const value = Number(formData.get('value'));
		const description = formData.get('description');
		const date = formData.get('date') || undefined;
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

		const user = event.locals.user;
		const { id } = await db.entry.create({
			data: {
				description: description as string,
				value: value as number,
				date: date as string,
				type: type?.toUpperCase() as EntryType,
				userId: user!.id
			}
		});

		throw redirect(302, `/entries/${id}`);
	}
};
