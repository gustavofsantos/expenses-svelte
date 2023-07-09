<script>
	import Money from '$lib/components/money.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>{data.category.name}</h1>

<h3>Entries</h3>

<section>
	<ul>
		{#each data.entries as entry}
			<li>
				<p>
					<a href={`/entries/${entry.id}`}>
						<strong><Money value={entry.value} /></strong>: {entry.description}
					</a>
				</p>
			</li>
		{/each}
	</ul>
</section>
