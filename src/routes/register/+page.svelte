<script lang="ts">
  import { z } from "zod";
  import { createUserWithEmailAndPassword } from "firebase/auth";
	import { auth } from "$lib/client/firebase";
	import { goto } from "$app/navigation";

  const RegistrationSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  let email = "";
  let password = "";
  let formErrors = new Map<string, string>();
  let registrationError: string | null = null;

  async function handleSubmit() {
    try {
      const validation = RegistrationSchema.safeParse({
        email,
        password,
      });
      if (!validation.success) {
        formErrors = new Map(validation.error.issues.map((error) => [error.path.join("."), error.message]));
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      goto("/login?message=Registration successful");
    } catch (e) {
      console.error(e);
    }
  }
</script>

<h1>Registration</h1>

<form on:submit|preventDefault={handleSubmit}>
  <label for="email-input">
    <span>Email</span>
    <input type="email" id="email-input" bind:value={email} />
    {#if formErrors.has("email")}
      <p class="text-red-500">{formErrors.get("email")}</p>
    {/if}
  </label>

  <label for="password-input">
    <span>Password</span>
    <input type="password" id="password-input" bind:value={password} />
    {#if formErrors.has("password")}
      <p class="text-red-500">{formErrors.get("password")}</p>
    {/if}
  </label>

  <button type="submit">Register</button>
</form>
