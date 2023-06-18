import { z } from 'zod';

export const EntrySchema = z.object({
  uid: z.string(),
  value: z.number(),
  description: z.string(),
  date: z.date(),
});

export type Entry = z.infer<typeof EntrySchema>;

