import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async (request) => {
  const { session } = await request.parent()
  if (!session?.user) {
    throw redirect(302, "/auth/login?message=You must be logged in to view this page.")
  }

  return {}
}
