<script lang="ts">
  import { z} from "zod";
  import type { ZodIssue } from "zod";

  const NewEntrySchema = z.object({
    description: z.string().nonempty(),
    value: z.number().positive(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  });

  let value = 0;
  let description = "";
  let date = "";
  let errors: Map<string, ZodIssue> | null = null;

  async function handleSubmit() {
    /**
    const validation = NewEntrySchema.safeParse({
      description,
      value,
      date,
    })
    
    if (!validation.success) {
      errors = new Map(validation.error.issues.map((error) => [error.path.join("."), error]));
      return;
    }
    */
  }
</script>

<svelte:head>
  <title>New entry</title>
</svelte:head>

<h1>New entry</h1>

<form on:submit|preventDefault={handleSubmit}>
  <label for="value-input">
    <span>Value</span>
    <input type="number" id="value-input" bind:value={value} />
    {#if errors?.has("value")}
      <p class="text-red-500">{errors.get("value")?.message}</p>
    {/if}
  </label>

  <label for="description-input">
    <span>Description</span>
    <input type="text" id="description-input" bind:value={description} />
    {#if errors?.has("description")}
      <p class="text-red-500">{errors.get("description")?.message}</p>
    {/if}
  </label>

  <label for="date-input">
    <span>Date</span>
    <input type="date" id="date-input" bind:value={date} />
    {#if errors?.has("date")}
      <p class="text-red-500">{errors.get("date")?.message}</p>
    {/if}
  </label>

  <button type="submit">Save</button>
</form>
