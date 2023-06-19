import { SvelteKitAuth } from "@auth/sveltekit"
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "@auth/core/providers/credentials"
import { z } from "zod"
import { db } from "$lib/db"

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const handle = SvelteKitAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, _request) {
        console.log("credentials", credentials)
        const validation = CredentialsSchema.safeParse(credentials)
        if (!validation.success) {
          return null
        }

        return { id: "123", email: "user@email" }
      }
    })
  ]
})
