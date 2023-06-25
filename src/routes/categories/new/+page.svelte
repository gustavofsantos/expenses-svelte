<script>
	import { enhance } from '$app/forms';

	export let form;
</script>

<svelte:head>
  <title>New Category</title>
</svelte:head>

<h1>New Category</h1>

<form method="POST" use:enhance>
	<label for="name-input">
		<span>Name</span>
		<input type="text" id="name-input" name="name" required />
		{#if form?.errors.fieldErrors.name}
			<p class="text-red-500">{form?.errors.fieldErrors.name.join(", ")}</p>
		{/if}
	</label>

	<button type="submit">Create</button>
</form>
  
