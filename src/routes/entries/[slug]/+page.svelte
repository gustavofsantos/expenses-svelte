<script>
	import { enhance } from '$app/forms';
	import Money from '$lib/components/money.svelte';
	import { format } from 'date-fns';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	let value = data.entry?.value;
	let type = data.entry?.type?.toLowerCase();
	let description = data.entry?.description;
	let date = data.entry?.date;

	$: formattedDate = date ? format(new Date(date), 'yyyy-MM-dd') : undefined;
</script>

<svelte:head>
	<title>Entry #{data.entry?.id}</title>
</svelte:head>

<h1>
	<Money {value} />
</h1>

<h3>#{data.entry?.id}</h3>

<section>
	<a href="/">Back to entries</a>
</section>

<form method="POST" action="?/update" use:enhance>
	<label for="value-input">
		<span>Value</span>
		<input id="value-input" name="value" {value} required />
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

	<button type="submit">Save</button>
</form>

<form method="POST" action="?/delete">
	<input type="hidden" name="id" value={data.entry?.id} />
	<button type="submit" data-delete>Delete</button>
</form>

<br />

<section>
	<ul>
		{#each data.categoriesOnEntry as category}
			<li class="flex justify-between items-center">
				<span>{category.name}</span>

				<div>
					<form method="POST" action="?/removecategory">
						<input type="hidden" name="entryId" value={data.entry.id} />
						<input type="hidden" name="categoryId" value={category.id} />
						<button type="submit" class="!block bg-red-500 text-red-100">Remove</button>
					</form>
				</div>
			</li>
		{/each}
	</ul>

	<ul>
		{#each data.categoriesNotOnEntry as category}
			<li class="flex justify-between items-center">
				<span>{category.name}</span>
				<div>
					<form method="POST" action="?/addcategory">
						<input type="hidden" name="entryId" value={data.entry.id} />
						<input type="hidden" name="categoryId" value={category.id} />
						<button type="submit">Add</button>
					</form>
				</div>
			</li>
		{/each}
	</ul>
</section>
