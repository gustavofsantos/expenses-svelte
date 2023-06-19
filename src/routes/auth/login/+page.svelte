<script lang="ts">
	import { enhance } from '$app/forms';

	export let form;
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<h1>Login</h1>

<form method="POST" use:enhance>
	<label for="email-input">
		<span>Email</span>
		<input type="email" id="email-input" name="email" required />
		{#if form?.error}
			<p class="text-red-500">{form?.errors.email}</p>
		{/if}
	</label>

	<label for="password-input">
		<span>Password</span>
		<input type="password" id="password-input" name="password" required />
		{#if form?.error}
			<p class="text-red-500">{form.errors.password}</p>
		{/if}
	</label>

	<button type="submit">Login</button>
	<hr />
	<a href="/register">Registration</a>
</form>
