<script lang="ts">
	import { formatIntegerToMoney } from '$lib/utils';

	export let totalExpenses: number;
	export let totalIncomes: number;
	export let balance: number;
</script>

<details>
	<summary>Stats</summary>
	<div class="grid grid-cols-3 gap-2 w-full">
		<div class="bg-red-100 rounded-lg py-2 px-3">
			<h3>Expenses</h3>
			<p>{formatIntegerToMoney(totalExpenses)}</p>
		</div>
		<div class="bg-green-100 rounded-lg py-2 px-3">
			<h3>Incomes</h3>
			<p>{formatIntegerToMoney(totalIncomes)}</p>
		</div>
		<div class="rounded-lg py-2 px-3">
			<h3>Balance</h3>
			<p>{formatIntegerToMoney(balance)}</p>
		</div>
	</div>
</details>
