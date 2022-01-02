<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";
  import type { snippetType } from "$lib/snippets";
  import { base } from "$app/paths";

  export const load: Load = async ({
    fetch,
  }): Promise<{ props: { snippets: snippetType[] } }> => {
    const snippets = await fetch(`${base}/snippets.json`).then((r) => r.json());
    return { props: { snippets } };
  };
</script>

<script lang="ts">
  export let snippets: snippetType[];
  console.log(snippets);
</script>

<svelte:head>
  <title>Jason Ash - Code Snippets</title>
</svelte:head>

<h1>Snippets</h1>
<p>Select code snippets and examples that can be copied and adapted.</p>
<table>
  <thead>
    <tr>
      <th>Title</th>
      <th>Description</th>
      <th>Last Updated</th>
    </tr>
  </thead>
  <tbody>
    {#each snippets as snippet}
      <tr>
        <td><a href={snippet.src}>{snippet.title}</a></td>
        <td>{snippet.description}</td>
        <td>{snippet.date}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    text-align: left;
  }
  table a {
    border: none;
  }
</style>
