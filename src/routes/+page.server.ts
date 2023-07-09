import {
	CATEGORIES_FILE_PATH,
	CATEGORIES_ON_ENTRIES_PATH,
	ENTRIES_FILE_PATH
} from '$env/static/private';
import { CategoriesOnEntriesRepository } from '$lib/categories-on-entries-repository';
import { CategoriesRepository } from '$lib/categories-repository';
import { CategoriesService } from '$lib/categories-service';
import { EntriesService } from '$lib/entries-service';
import type { PageServerLoad } from './$types';

const entriesServices = new EntriesService(ENTRIES_FILE_PATH);
const categoriesOnEntriesRepository = new CategoriesOnEntriesRepository(CATEGORIES_ON_ENTRIES_PATH);
const categoriesRepo = new CategoriesRepository(CATEGORIES_FILE_PATH);
const categoriesService = new CategoriesService(categoriesRepo);

export const load: PageServerLoad = async (event) => {
	const fromDate = event.url.searchParams.get('fromDate') || undefined;
	const toDate = event.url.searchParams.get('toDate') || undefined;

	const entries = await entriesServices.loadAll({
		fromDate: fromDate ? new Date(fromDate) : undefined,
		toDate: toDate ? new Date(toDate) : undefined
	});
	const categoriesAndEntries = await Promise.all(
		entries.map((entry) => categoriesOnEntriesRepository.findByEntryId(entry.id))
	);

	for (let i = 0; i < entries.length; i++) {
		const categories = await Promise.all(
			categoriesAndEntries[i].map((c) => categoriesService.findById(c.categoryId))
		);
		entries[i].categories = categories;
	}

	return { entries };
};
