<script lang="ts">
	import { page } from '$app/stores';

	export let data;
	let message = $page.url.searchParams.get('message');
	let fromDate = $page.url.searchParams.get('fromDate') || null;
	let toDate = $page.url.searchParams.get('toDate') || null;

	$: entries = data.entries.map((entry) => ({
		...entry,
		value: new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(entry.value / 100),
		rawValue: entry.value,
		date: new Date(entry.date).toLocaleDateString('pt-BR')
	}));
	$: totalExpenses = entries
		.filter((entry) => entry.type === 'expense')
		.reduce((acc, entry) => acc + entry.rawValue, 0);
	$: totalIncomes = entries
		.filter((entry) => entry.type === 'income')
		.reduce((acc, entry) => acc + entry.rawValue, 0);
	$: balance = totalIncomes - totalExpenses;

	function formatIntegerToMoney(value: number) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value / 100);
	}

	function clearMessage() {
		message = null;
	}
</script>

<svelte:head>
	<title>Expenses</title>
</svelte:head>

<h1 class="text-3xl">Expenses</h1>

{#if message}
	<section
		class="flex flex-col space-y-4 justify-start items-start p-4 bg-blue-50 border border-blue-200 text-blue-900 rounded-md my-4"
	>
		<p>{message}</p>
		<button class="bg-blue-100 px-2 py-1 rounded text-blue-900" on:click={clearMessage}
			>Close</button
		>
	</section>
{/if}

<section class="flex space-x-2 mb-4">
	<a href="/entries/new">New entry</a>
</section>

<section id="filter">
	<h3>Filter</h3>
	<form method="GET">
		<label for="from-date-input">
			<span>From</span>
			<input type="date" id="from-date-input" name="fromDate" value={fromDate} />
		</label>
		<label for="to-date-input">
			<span>To</span>
			<input type="date" id="to-date-input" name="toDate" value={toDate} />
		</label>
		<button type="submit">Filter</button>
		<button type="reset">Clear</button>
	</form>
</section>

<section class="w-full my-4">
	<details>
		<summary>Stats</summary>
		<div class="grid grid-cols-3 gap-2 w-full">
			<div>
				<h3>Expenses</h3>
				<p>{formatIntegerToMoney(totalExpenses)}</p>
			</div>
			<div>
				<h3>Incomes</h3>
				<p>{formatIntegerToMoney(totalIncomes)}</p>
			</div>
			<div>
				<h3>Balance</h3>
				<p>{formatIntegerToMoney(balance)}</p>
			</div>
		</div>
	</details>
</section>

<section>
	{#if entries.length > 0}
		<ul class="divide-y divide-gray-300">
			{#each entries as entry}
				<li class="py-2">
					<div class="flex justify-between items-center">
						<div class="flex space-x-2 items-center">
							{#if entry.type === 'expense'}
								<span class="bg-red-100 text-red-800 h-6 w-6 text-center rounded-full">
									&larr;
								</span>
							{:else if entry.type === 'income'}
								<span class="bg-green-100 text-green-800 h-6 w-6 text-center rounded-full">
									&rarr;
								</span>
							{:else}
								<span class="bg-gray-500 h-2 w-2 rounded-full" />
							{/if}
							<strong><a href={`/entries/${entry.id}`}>{entry.value}</a></strong>
						</div>
						<small>{entry.date}</small>
					</div>
					<p>{entry.description}</p>
					{#if entry.categories}
						<ul class="flex space-x-1 pt-1">
							{#each entry.categories as category}
								<li>
									<small
										class="bg-purple-100 text-purple-700 border border-purple-300 px-1 rounded-md block"
										>{category.category.name}</small
									>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	{:else}
		<p>No entries</p>
	{/if}
</section>
