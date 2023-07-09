import { z } from 'zod';

export type Category = z.infer<typeof CategorySchema>;

export const CategorySchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(3).max(255)
});
