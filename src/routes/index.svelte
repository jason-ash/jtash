<script context="module" lang="ts">
  import { base } from "$app/paths";

  export const load = async ({ fetch }) => {
    const titles = await fetch(`${base}/index.json`).then((r) => r.json());
    return { props: { titles } };
  };
</script>

<script>
  export let titles;
</script>

<h1>Hello World</h1>
{#each titles as title}
  <p>{title}</p>
{/each}
