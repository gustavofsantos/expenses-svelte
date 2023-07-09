import { CATEGORIES_FILE_PATH } from '$env/static/private';
import { CategoriesRepository } from '$lib/categories-repository';
import { CategoriesService } from '$lib/categories-service';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions } from './$types';

const categoriesRepo = new CategoriesRepository(CATEGORIES_FILE_PATH);
const categoriesService = new CategoriesService(categoriesRepo);

const NewCategorySchema = z.object({
	name: z.string().min(3).max(255)
});

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const name = formData.get('name') as string;

		const newCategory = NewCategorySchema.safeParse({ name });
		if (!newCategory.success) {
			return fail(400, {
				errors: newCategory.error.flatten()
			});
		}

		const category = await categoriesService.create(newCategory.data.name);

		throw redirect(302, `/categories/${category.id}`);
	}
};
