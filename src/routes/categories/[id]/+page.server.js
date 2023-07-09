import {
	CATEGORIES_FILE_PATH,
	CATEGORIES_ON_ENTRIES_PATH,
	ENTRIES_FILE_PATH
} from '$env/static/private';
import { CategoriesOnEntriesRepository } from '$lib/categories-on-entries-repository';
import { CategoriesRepository } from '$lib/categories-repository';
import { CategoriesService } from '$lib/categories-service';
import { EntriesService } from '$lib/entries-service';
import { error } from '@sveltejs/kit';

const categoriesRepo = new CategoriesRepository(CATEGORIES_FILE_PATH);
const categoriesService = new CategoriesService(categoriesRepo);
const categoriesOnEntries = new CategoriesOnEntriesRepository(CATEGORIES_ON_ENTRIES_PATH);
const entriesService = new EntriesService(ENTRIES_FILE_PATH);

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const id = params.id;
	const category = await categoriesService.findById(id);
	const categoriesAndEntries = await categoriesOnEntries.findByCategoryId(id);
	const allEntries = await entriesService.loadAll();
	const entries = allEntries.filter((entry) =>
		categoriesAndEntries.some((v) => v.entryId === entry.id)
	);

	if (!category) throw error(404, 'Category not found');

	return {
		category,
		entries
	};
}
