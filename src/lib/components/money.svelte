<script lang="ts">
	import { formatIntegerToMoney } from '$lib/utils';

	export let value: number;
</script>

<span>{formatIntegerToMoney(value)}</span>
