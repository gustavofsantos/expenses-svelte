<script lang="ts">
	import { enhance } from '$app/forms';

	export let form;
  export let data;
</script>

<svelte:head>
	<title>New entry</title>
</svelte:head>

<h1>New entry</h1>

<form method="POST" use:enhance>
	<label for="value-input">
		<span>Value</span>
		<input type="number" id="value-input" name="value" required />
		{#if form?.errors.fieldErrors.value}
			<p class="text-red-500">{form.errors.fieldErrors.value.join(', ')}</p>
		{/if}
	</label>

	<label for="type-input">
		<span>Type</span>
		<select id="type-input" name="type">
			<option value="expense">Expense</option>
			<option value="income">Income</option>
		</select>
		{#if form?.errors.fieldErrors.type}
			<p class="text-red-500">{form?.errors.fieldErrors.type}</p>
		{/if}
	</label>

	<label for="description-input">
		<span>Description</span>
		<input type="text" id="description-input" name="description" />
		{#if form?.errors.fieldErrors.description}
			<p class="text-red-500">{form?.errors.fieldErrors.description}</p>
		{/if}
	</label>

	<label for="date-input">
		<span>Date</span>
		<input type="date" id="date-input" name="date" />
		{#if form?.errors.fieldErrors.date}
			<p class="text-red-500">{form?.errors.fieldErrors.date}</p>
		{/if}
	</label>

  <label for="categories-input">
    <span>Categories</span>
    <select id="categories-input" name="categories" multiple>
      {#each data.categories as category}
        <option value={category.id}>{category.name}</option>
      {/each}
    </select>
    {#if form?.errors.fieldErrors.categories}
      <p class="text-red-500">{form?.errors.fieldErrors.categories}</p>
    {/if}
  </label>

	<button type="submit">Save</button>
</form>
