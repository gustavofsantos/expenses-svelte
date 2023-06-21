import { z } from 'zod'
import { db } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { EntryType } from '@prisma/client';

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

export const load: PageServerLoad = async (event) => {
	const entryId = event.params.slug;
	const entry = await db.entry.findFirst({
		where: { id: entryId, userId: event.locals.user!.id }
	});

	return { entry };
};

export const actions: Actions = {
  update: async (event) => {
    const entryId = event.params.slug;
    const formData = await event.request.formData()
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

    await db.entry.updateMany({
      where: { id: entryId, userId: event.locals.user!.id },
      data: {
        value,
        description: description as string,
        date: date ? new Date(date as string) : undefined,
        type: type?.toUpperCase() as EntryType
      }
    });

    const entry = await db.entry.findFirst({
      where: { id: entryId, userId: event.locals.user!.id }
    });

    return { success: true, entry }
  },
  delete: async (event) => {
    const entryId = event.params.slug;
    await db.entry.deleteMany({
      where: { id: entryId, userId: event.locals.user!.id }
    });

    throw redirect(308, '/');
  }
}
