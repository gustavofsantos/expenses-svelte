<script lang="ts">
	export let data;
</script>

<h1>Entry #{data.entry?.id}</h1>

<p>
	<strong>Value:</strong>
	{data.entry?.value}
</p>

<p><strong>Description:</strong>{data.entry?.description}</p>
