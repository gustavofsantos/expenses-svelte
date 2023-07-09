import { z } from 'zod';

export type CategoryOnEntry = z.infer<typeof CategoryOnEntrySchema>;

export const CategoryOnEntrySchema = z.object({
	categoryId: z.string().uuid(),
	entryId: z.string().uuid(),
	date: z.date()
});
