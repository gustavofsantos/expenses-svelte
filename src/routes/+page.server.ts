import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		throw redirect(302, '/login?message=You must be logged in to view this page');
	}

	const entries = await db.entry.findMany({
		where: { userId: user.id },
		orderBy: { date: 'desc' }
	});

	return { user, entries };
};
