<script context="module" lang="ts">
  import type { postType } from "$lib/posts";
  import { base } from "$app/paths";

  export const load = async ({
    page,
    fetch,
  }): Promise<{ props: { post: postType } }> => {
    const slug = page.params.slug;
    const post = await fetch(`${base}/${slug}.json`).then((r) => r.json());
    return {
      props: { post },
    };
  };
</script>

<script lang="ts">
  export let post: postType;
  console.log(post);
</script>

<svelte:head>
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

<h1 class="title">{post.title}</h1>
<p class="info">{post.date}</p>
{@html post.content}
