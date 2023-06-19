import { db } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { Actions } from './$types';

const RegistrationDataSchema = z.object({
	name: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(8)
});

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const password = formData.get('password');

		const validation = RegistrationDataSchema.safeParse({ name, email, password });
		if (!validation.success) {
			return fail(400, {
				name,
				email,
				error: 'Invalid data',
				errors: validation.error.flatten()
			});
		}

		try {
			const hashedPassword = bcrypt.hashSync(password as string, 10);
			await db.user.create({
				data: {
					name: name as string,
					email: email as string,
					password: {
						create: {
							hashedPassword
						}
					}
				}
			});
		} catch (error) {
			return fail(400, {
				name,
				email,
				error: 'Email already exists',
				errors: {}
			});
		}

		throw redirect(300, '/auth/login?message=Registration successful');
	}
};
