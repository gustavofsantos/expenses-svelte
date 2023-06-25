import { db } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		throw redirect(302, '/login?message=You must be logged in to view this page');
	}

  const fromDate = event.url.searchParams.get('fromDate') || undefined
  const toDate = event.url.searchParams.get('toDate') || undefined

	const entries = await db.entry.findMany({
		where: {
      userId: user.id,
      date: {
        gte: fromDate && new Date(fromDate),
        lte: toDate && new Date(toDate)
      }
    },
		orderBy: { date: 'desc' },
    include: {
      categories: {
        include: {
          category: true
        }
      }
    }
	});

	return { user, entries };
};
