<script lang="ts">
  import { z } from "zod";
  import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
	import { auth } from "$lib/client/firebase";
	import { goto } from "$app/navigation";
	import { authUser } from "$lib/client/authStore";

  const LoginDataSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
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

      const user = await signInWithEmailAndPassword(auth, email, password);
      await setPersistence(auth, browserLocalPersistence)

      $authUser = { uid: user.user.uid, email: user.user.email as string };
      goto("/");
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

  <button type="submit">Login</button>
</form>
