import { z } from 'zod';

export type Entry = z.infer<typeof EntrySchema>;

export type EntryType = 'income' | 'expense';

export const EntrySchema = z.object({
	id: z.string(),
	value: z.number().int(),
	type: z.enum(['income', 'expense']),
	description: z.string().optional(),
	date: z.date().default(() => new Date())
});
