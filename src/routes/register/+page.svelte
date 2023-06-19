<script lang="ts">
  import { enhance } from "$app/forms";

	export let form;
</script>

<svelte:head>
	<title>Registration</title>
</svelte:head>

<h1>Registration</h1>

<form method="POST" use:enhance>
	<label for="name-input">
		<span>Name</span>
		<input type="text" id="name-input" name="name" />
		{#if form?.error}
			<p class="text-red-500">Unable to register</p>
		{/if}
	</label>
	<label for="email-input">
		<span>Email</span>
		<input type="email" id="email-input" name="email" />
		{#if form?.error}
			<p class="text-red-500">Unable to register</p>
		{/if}
	</label>

	<label for="password-input">
		<span>Password</span>
		<input type="password" id="password-input" name="password" />
		{#if form?.error}
			<p class="text-red-500">Unable to register</p>
		{/if}
	</label>

	<button type="submit">Register</button>
	<hr />
	<a href="/auth/login">Login</a>
</form>
