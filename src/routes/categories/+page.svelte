<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>Categories</h1>

<section>
	<ul>
		{#each data.categories as category}
			<li class="flex justify-between">
				<a href={`/categories/${category.id}`}>
					<p>{category.name}</p>
				</a>

				<form method="POST" action="?/delete" class="w-min">
					<input type="hidden" name="id" value={category.id} />
					<button type="submit" class="!block bg-red-600 border-red-800 text-red-50">Delete</button>
				</form>
			</li>
		{/each}
	</ul>
</section>
