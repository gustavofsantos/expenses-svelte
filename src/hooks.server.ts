import { SvelteKitAuth } from "@auth/sveltekit"
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "@auth/core/providers/credentials"
import { z } from "zod"
import { db } from "$lib/db"
import bcrypt from "bcryptjs"

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
        const email = credentials.email as string
        const password = credentials.password as string
        const validation = CredentialsSchema.safeParse({ email, password })
        if (!validation.success) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email },
          include: { password: true }
        })
        if (!user) {
          return null
        }

        if (bcrypt.compareSync(password, user.password!.hashedPassword)) {
          return { id: user.id, email: user.email, name: user.name }
        }

        return null
      }
    })
  ]
})
