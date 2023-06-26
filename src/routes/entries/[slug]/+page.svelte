<script lang="ts">
	import { enhance } from '$app/forms';
  import {format} from "date-fns";

  export let form;
	export let data;

  let value = data.entry?.value;
  let type = data.entry?.type?.toLowerCase();
  let description = data.entry?.description;
  let date = data.entry?.date;
  let categories = data.entry?.categories;

  $: formattedDate = date ? format(date, 'yyyy-MM-dd') : undefined
</script>

<svelte:head>
  <title>Entry #{data.entry?.id}</title>
</svelte:head>

<h1>Entry #{data.entry?.id}</h1>

<section>
  <a href="/">Back to entries</a>
</section>

<form method="POST" action="?/update" use:enhance>
	<label for="value-input">
		<span>Value</span>
		<input id="value-input" name="value" value={value} required />
		{#if form?.errors?.fieldErrors.value}
			<p class="text-red-500">{form.errors.fieldErrors.value.join(', ')}</p>
		{/if}
	</label>

	<label for="type-input">
		<span>Type</span>
		<select id="type-input" name="type" value={type}>
			<option value="expense">Expense</option>
			<option value="income">Income</option>
		</select>
		{#if form?.errors?.fieldErrors.type}
			<p class="text-red-500">{form?.errors.fieldErrors.type}</p>
		{/if}
	</label>

	<label for="description-input">
		<span>Description</span>
		<input type="text" id="description-input" name="description" value={description} />
		{#if form?.errors?.fieldErrors.description}
			<p class="text-red-500">{form?.errors.fieldErrors.description}</p>
		{/if}
	</label>

	<label for="date-input">
		<span>Date</span>
		<input type="date" id="date-input" name="date" value={formattedDate} />
		{#if form?.errors?.fieldErrors.date}
			<p class="text-red-500">{form?.errors.fieldErrors.date}</p>
		{/if}
	</label>

  {#if data.categories}
    <label for="categories-input">
      <span>Categories</span>
      <select id="categories-input" name="categories" bind:value={categories} multiple>
        {#each data.categories as category}
          <option value={category.id} selected>{category.name}</option>
        {/each}
      </select>
      {#if form?.errors?.fieldErrors.categories}
        <p class="text-red-500">{form?.errors.fieldErrors.categories}</p>
      {/if}
    </label>
  {/if}

	<button type="submit">Save</button>
</form>

<form method="POST" action="?/delete">
  <input type="hidden" name="id" value={data.entry?.id} />
  <button type="submit" data-delete>Delete</button>
</form>
