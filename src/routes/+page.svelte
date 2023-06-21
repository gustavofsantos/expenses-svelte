<script lang="ts">
	export let data;

	$: entries = data.entries.map((entry) => ({
		...entry,
		value: new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(entry.value / 100),
    rawValue: entry.value,
		date: new Date(entry.date).toLocaleDateString('pt-BR')
	}));
  $: totalExpenses = entries.filter((entry) => entry.type === 'EXPENSE').reduce((acc, entry) => acc + entry.rawValue, 0);
  $: totalIncomes = entries.filter((entry) => entry.type === 'INCOME').reduce((acc, entry) => acc + entry.rawValue, 0);
  $: balance = totalIncomes - totalExpenses;

  function formatIntegerToMoney(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  }

</script>

<svelte:head>
	<title>Expenses</title>
</svelte:head>

<h1 class="text-3xl">Expenses</h1>

<section class="mb-4">
	<a href="/entries/new">New entry</a>
</section>


<section class="w-full my-4 ">
  <details>
    <summary>Stats</summary>
    <div class="grid grid-cols-3 gap-2 w-full">
      <div>
        <h2>Expenses</h2>
        <p>{formatIntegerToMoney(totalExpenses)}</p>
      </div>
      <div>
        <h2>Incomes</h2>
        <p>{formatIntegerToMoney(totalIncomes)}</p>
      </div>
      <div>
        <h2>Balance</h2>
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
							{#if entry.type === 'EXPENSE'}
								<span class="bg-red-500 h-2 w-2 rounded-full" />
							{:else if entry.type === 'INCOME'}
								<span class="bg-green-500 h-2 w-2 rounded-full" />
							{:else}
								<span class="bg-gray-500 h-2 w-2 rounded-full" />
							{/if}
							<strong><a href={`/entries/${entry.id}`}>{entry.value}</a></strong>
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
