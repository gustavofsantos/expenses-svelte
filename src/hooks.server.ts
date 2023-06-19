import { AUTH_SECRET } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const protectedPaths = ['/'];

export const handle: Handle = async ({ event, resolve }) => {
	const authorizationTokenCookie = event.cookies.get('Authorization');
	if (authorizationTokenCookie) {
		const token = authorizationTokenCookie.split(' ')[1];
		if (token) {
			try {
				const decoded = jwt.verify(token, AUTH_SECRET);
				event.locals.user = decoded;
			} catch (error) {
				event.locals.user = null;
				console.error(error);
			}
		}
	}

	return await resolve(event);
};
