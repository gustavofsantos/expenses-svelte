import { db } from "$lib/db";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { z } from "zod";

const NewCategorySchema = z.object({
  name: z.string().min(3).max(255),
})


export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
  console.log(user)
	if (!user) {
		throw redirect(302, '/login?message=You must be logged in to view this page');
	}

  return {}
}

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData()
    const name = formData.get("name") as string
    const validation = NewCategorySchema.safeParse({ name })

    if (!validation.success) {
      return fail(400, {
        name,
        errors: validation.error.flatten(),
      })
    }

    const user = event.locals.user
    const category = await db.category.create({ data: { name, userId: user!.id } })

    throw redirect(302, `/?message=Category "${category.name}" created`)
  }
}
