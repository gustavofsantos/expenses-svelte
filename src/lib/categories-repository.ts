import { readFile, writeFile } from 'fs/promises';
import type { Category } from '$lib/models/category';

const DEFAULT_FILE = {
	categories: [{ id: 1, name: 'Category 1' }]
};

export class CategoriesRepository {
	constructor(private readonly categoriesFilePath: string) {}

	async create(newCategory: { id: string; name: string }) {
		await this.initFile();
		const { categories } = await this.loadFile();

		categories.push(newCategory);
		await writeFile(this.categoriesFilePath, JSON.stringify({ categories }));

		return newCategory;
	}

	async deleteById(id: string) {
		const { categories } = await this.loadFile();
		const newCategories = categories.filter((category: Category) => category.id !== id);
		await writeFile(this.categoriesFilePath, JSON.stringify({ categories: newCategories }));
	}

	async findById(id: string): Promise<Category | undefined> {
		const categories = await this.findAll();
		return categories.find((category: Category) => category.id === id);
	}

	async findAll(): Promise<Category[]> {
		await this.initFile();
		const { categories } = await this.loadFile();
		return categories;
	}

	private async loadFile() {
		const contents = await readFile(this.categoriesFilePath, 'utf-8');
		return JSON.parse(contents);
	}

	private async initFile() {
		try {
			await this.loadFile();
		} catch (err) {
			await writeFile(this.categoriesFilePath, JSON.stringify(DEFAULT_FILE));
		}
	}
}
