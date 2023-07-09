<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>{data.category.name}</h1>

<h3>Entries</h3>

<section>
	<ul>
		{#each data.entries as entry}
			<li>
				<p><strong>{entry.value}</strong>: {entry.description}</p>
			</li>
		{/each}
	</ul>
</section>
