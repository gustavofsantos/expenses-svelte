<script lang="ts">
	export let data;

	$: entries = data.entries.map((entry) => ({
		...entry,
		value: new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(entry.value / 100),
		date: new Date(entry.date).toLocaleDateString('pt-BR')
	}));

	$: console.log(entries);
</script>

<svelte:head>
	<title>Expenses</title>
</svelte:head>

<h1 class="text-3xl">Expenses</h1>

<section class="mb-4">
	<a href="/entries/new">New entry</a>
</section>

<section>
	{#if entries.length > 0}
		<ul class="divide-y divide-gray-400">
			{#each entries as entry}
				<li>
					<div class="flex justify-between items-center">
						<div class="flex space-x-2 items-center">
							{#if entry.type === 'EXPENSE'}
								<span class="bg-red-500 h-2 w-2 rounded-full" />
							{:else if entry.type === 'INCOME'}
								<span class="bg-green-500 h-2 w-2 rounded-full" />
							{:else}
								<span class="bg-gray-500 h-2 w-2 rounded-full" />
							{/if}
							<strong>{entry.value}</strong>
						</div>
						<small>{entry.date}</small>
					</div>
					<p>{entry.description}</p>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No entries</p>
	{/if}
</section>
