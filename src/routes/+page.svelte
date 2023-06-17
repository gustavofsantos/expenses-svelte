<script lang="ts">
  import type { LoadData } from "./+page";

  export let data: LoadData;
</script>

<h1 class="text-3xl">Expenses</h1>

{#each data?.entries as expense}
  <div class="flex justify-between items-center">
    <div class="flex items-center">
      <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
        <span class="text-2xl">{expense.value}</span>
      </div>
      <div class="ml-4">
        <h2 class="text-xl">{expense.description}</h2>
        <p class="text-gray-600">{expense.date}</p>
      </div>
    </div>
  </div>
{/each}
