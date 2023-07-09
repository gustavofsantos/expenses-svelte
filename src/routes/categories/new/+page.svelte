<script>
	import { enhance } from '$app/forms';

	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<h1>New Category</h1>

<form method="POST" use:enhance>
	<label for="name">
		<span>Name</span>
		<input type="text" id="name" name="name" required />
		{#if form?.errors.fieldErrors.name}
			<p class="text-red-500">{form.errors.fieldErrors.name.join(', ')}</p>
		{/if}
	</label>

	<button type="submit">Save</button>
</form>
