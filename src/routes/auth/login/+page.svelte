<script lang="ts">
  import { z } from "zod";
  import { signIn } from "@auth/sveltekit/client"
	import { goto } from "$app/navigation";

  const LoginDataSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  let email = "";
  let password = "";
  let formErrors = new Map<string, string>();

  async function handleSubmit() {
    try {
      const validation = LoginDataSchema.safeParse({
        email,
        password,
      });
      if (!validation.success) {
        formErrors = new Map(validation.error.issues.map((error) => [error.path.join("."), error.message]));
        return;
      }

      await signIn("credentials", { email, password })
    } catch (e) {
      console.error(e);
    }
  }

</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<h1>Login</h1>

<form on:submit|preventDefault={handleSubmit}>
  <label for="email-input">
    <span>Email</span>
    <input type="email" id="email-input" required="true" bind:value={email} />
    {#if formErrors.has("email")}
      <p class="text-red-500">{formErrors.get("email")}</p>
    {/if}
  </label>

  <label for="password-input">
    <span>Password</span>
    <input type="password" id="password-input" required="true" bind:value={password} />
    {#if formErrors.has("password")}
      <p class="text-red-500">{formErrors.get("password")}</p>
    {/if}
  </label>

  <button type="submit">Login</button>
  <hr />
  <a href="/register">Registration</a>
</form>
