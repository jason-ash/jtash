<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";
  import type { postType } from "$lib/posts";
  import { base } from "$app/paths";

  export const load: Load = async ({
    params,
    fetch,
  }): Promise<{ props: { post: postType } }> => {
    const post = await fetch(`${base}/${params.slug}.json`).then((r) => r.json());
    return {
      props: { post },
    };
  };
</script>

<script lang="ts">
  import TwitterSummaryCard from "$lib/components/SEO/TwitterSummaryCard.svelte";
  export let post: postType;
</script>

<svelte:head>
  <title>{post.title}</title>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css"
    integrity="sha384-R4558gYOUz8mP9YWpZJjofhk+zx0AS11p36HnD2ZKj/6JR5z27gSSULCNHIRReVs"
    crossorigin="anonymous"
  />
  <script
    defer
    src="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.js"
    integrity="sha384-z1fJDqw8ZApjGO3/unPWUPsIymfsJmyrDVWC8Tv/a1HeOtGmkwNd/7xUS0Xcnvsx"
    crossorigin="anonymous">
  </script>
</svelte:head>

<TwitterSummaryCard {post} />

<div>
  <div class="title">
    <h1>{post.title}</h1>
    <p>{post.date}</p>
  </div>
  <hr />
  <div class="post">
    {@html post.content}
  </div>
</div>

<style>
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
  }
  .title h1 {
    margin-block-end: 0.4rem;
    margin-block-start: 0.4rem;
  }
  .title p {
    color: var(--text-color-secondary);
  }
  .post :global(h1) {
    font-size: 1.5rem;
  }
  .post :global(h2) {
    font-size: 1.25rem;
  }
</style>
