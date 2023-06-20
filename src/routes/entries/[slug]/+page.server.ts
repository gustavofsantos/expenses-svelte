import { db } from '$lib/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const entryId = event.params.slug;
	const entry = await db.entry.findFirst({
		where: { id: entryId, userId: event.locals.user!.id }
	});

	return { entry };
};
