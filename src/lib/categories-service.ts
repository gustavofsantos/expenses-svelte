import { randomUUID } from 'crypto';

import type { CategoriesRepository } from '$lib/categories-repository';
import { CategorySchema, type Category } from '$lib/models/category';

export class CategoriesService {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	async create(name: string): Promise<Category> {
		const id = randomUUID();

		const newCategory = CategorySchema.parse({ id, name });
		await this.categoriesRepository.create(newCategory);

		return newCategory;
	}

	async deleteById(id: string): Promise<void> {
		await this.categoriesRepository.deleteById(id);
	}

	async findAll(): Promise<Category[]> {
		return this.categoriesRepository.findAll();
	}
}
