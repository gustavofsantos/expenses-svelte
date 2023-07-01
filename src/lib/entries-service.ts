import * as fs from 'node:fs/promises';
import * as crypto from 'node:crypto';

import { EntrySchema, type Entry } from '../models/entry';

export type LoadFilter = {
	fromDate?: Date;
	toDate?: Date;
};

export class EntriesService {
	constructor(private readonly entriesFilePath: string) {}

	async create(data: Partial<Entry>): Promise<Entry> {
		const id = crypto.randomUUID();
		const entry = await EntrySchema.parseAsync({ ...data, id });
		const entries = await this.loadAll();
		entries.push(entry);

		await this.saveEntries(entries);

		return entry;
	}

	async update(id: string, data: Partial<Entry>): Promise<Entry | undefined> {
		const entry = await this.findById(id);
		if (!entry) return undefined;

		const updatedEntry = await EntrySchema.parseAsync({ ...entry, ...data, id });
		const entries = await this.loadAll();
		const entryIndex = entries.findIndex((entry) => entry.id === id);
		entries[entryIndex] = updatedEntry;
		await this.saveEntries(entries);
		return updatedEntry;
	}

	async delete(id: string): Promise<Entry | undefined> {
		const entry = await this.findById(id);
		if (!entry) return undefined;

		const entries = await this.loadAll();
		const entryIndex = entries.findIndex((entry) => entry.id === id);
		entries.splice(entryIndex, 1);
		await this.saveEntries(entries);
	}

	async findById(id: string): Promise<Entry | undefined> {
		const entries = await this.loadAll();
		return entries.find((entry) => entry.id === id);
	}

	async loadAll(filter?: LoadFilter): Promise<Entry[]> {
		const contents = await fs.readFile(this.entriesFilePath, 'utf-8');
		const parsedFile = JSON.parse(contents) as { entries: Entry[] };
		if (filter) {
			return parsedFile.entries.filter((entry) => {
				if (filter.fromDate && new Date(entry.date) < filter.fromDate) return false;
				if (filter.toDate && new Date(entry.date) > filter.toDate) return false;
				return true;
			});
		}

		return parsedFile.entries;
	}

	async saveEntries(entries: Entry[]): Promise<void> {
		const contents = JSON.stringify({ entries }, null, 2);
		await fs.writeFile(this.entriesFilePath, contents);
	}
}
