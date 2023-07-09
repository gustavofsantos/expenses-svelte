import { CategoriesService } from '$lib/categories-service';
import { CategoriesRepository } from '$lib/categories-repository';
import { CATEGORIES_FILE_PATH } from '$env/static/private';
import type { Actions } from '../$types';

const categoriesRepo = new CategoriesRepository(CATEGORIES_FILE_PATH);
const categoriesService = new CategoriesService(categoriesRepo);

export async function load() {
	const categories = await categoriesService.findAll();

	return {
		categories
	};
}

export const actions: Actions = {
	delete: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string;
		await categoriesService.deleteById(id);

		return {
			status: 204
		};
	}
};
