import { z } from 'zod';

export const EntrySchema = z.object({
  id: z.string(),
  value: z.number(),
  description: z.string(),
  date: z.date(),
});

export type Entry = z.infer<typeof EntrySchema>;

