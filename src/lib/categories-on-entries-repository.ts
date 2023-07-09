import { readFile, writeFile } from 'fs/promises';
import type { CategoryOnEntry } from './models/category-on-entry';

const DEFAULT_FILE = {
	categoriesOnEntries: []
};

export class CategoriesOnEntriesRepository {
	constructor(private readonly categoriesOnEntriesFilePath: string) {}

	async create(newCategoryOnEntry: { categoryId: string; entryId: string; date: Date }) {
		await this.initFile();
		const { categoriesOnEntries } = await this.loadFile();

		categoriesOnEntries.push({
			...newCategoryOnEntry,
			date: newCategoryOnEntry.date.toISOString()
		});

		await writeFile(this.categoriesOnEntriesFilePath, JSON.stringify({ categoriesOnEntries }));
	}

	async findByCategoryId(categoryId: string) {
		const categoriesOnEntries = await this.loadAll();
		return categoriesOnEntries.filter(
			(categoryOnEntry: CategoryOnEntry) => categoryOnEntry.categoryId === categoryId
		);
	}

	async findByEntryId(entryId: string) {
		const categoriesOnEntries = await this.loadAll();
		return categoriesOnEntries.filter(
			(categoryOnEntry: CategoryOnEntry) => categoryOnEntry.entryId === entryId
		);
	}

	async loadAll(): Promise<CategoryOnEntry[]> {
		await this.initFile();
		const { categoriesOnEntries } = await this.loadFile();
		return categoriesOnEntries.map((categoryOnEntry: CategoryOnEntry) => ({
			...categoryOnEntry,
			date: new Date(categoryOnEntry.date)
		}));
	}

	async loadFile() {
		const contents = await readFile(this.categoriesOnEntriesFilePath, 'utf-8');
		return JSON.parse(contents);
	}

	async initFile() {
		try {
			await this.loadFile();
		} catch (err) {
			await writeFile(this.categoriesOnEntriesFilePath, JSON.stringify(DEFAULT_FILE));
		}
	}
}
