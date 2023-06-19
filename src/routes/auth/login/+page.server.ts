import { AUTH_SECRET } from '$env/static/private';
import { db } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const user = await db.user.findUnique({
			where: { email: email as string },
			include: { password: true }
		});
		if (!user) {
			return fail(400, {
				email,
				error: 'Invalid data',
				errors: {}
			});
		}

		if (!bcrypt.compareSync(password as string, user.password!.hashedPassword)) {
			return fail(400, {
				email,
				error: 'Invalid data',
				errors: {}
			});
		}

		const jwtData = {
			id: user.id,
			name: user.name,
			email: user.email
		};

		const token = jwt.sign(jwtData, AUTH_SECRET, {
			expiresIn: '1d'
		});

		event.cookies.set('Authorization', `Bearer ${token}`, {
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 // 1 day
		});

		throw redirect(302, '/');
	}
};
