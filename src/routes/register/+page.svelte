<script lang="ts">
  import { z } from "zod";
	import { goto } from "$app/navigation";

  const RegistrationSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  let email = "";
  let password = "";
  let formErrors = new Map<string, string>();

  async function handleSubmit() {
  }
</script>

<svelte:head>
  <title>Registration</title>
</svelte:head>

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
  <hr />
  <a href="/login">Login</a>
</form>
