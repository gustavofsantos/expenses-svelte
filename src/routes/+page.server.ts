import { ENTRIES_FILE_PATH } from '$env/static/private';
import { EntriesService } from '$lib/entries-service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const fromDate = event.url.searchParams.get('fromDate') || undefined;
	const toDate = event.url.searchParams.get('toDate') || undefined;

	const entriesServices = new EntriesService(ENTRIES_FILE_PATH);
	const entries = await entriesServices.loadAll();

	return { entries };
};
