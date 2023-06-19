// export const load: PageServerLoad = async (event) => {};

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	console.log(user);
	if (!user) {
		throw redirect(302, '/login?message=You must be logged in to view this page');
	}

	return { user };
};
