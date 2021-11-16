<script context="module" lang="ts">
  import { base } from "$app/paths";

  export const load = async ({ fetch }) => {
    const posts = await fetch(`${base}/index.json`).then((r) => r.json());
    return { props: { posts } };
  };
</script>

<script>
  export let posts;
  console.log(posts);
</script>

<h1>Hello! I'm Jason.</h1>
<p>
  I created this site to write about things that I find interesting: probability &
  Bayesian inference, data visualization, puzzles & games, finance, and books.
</p>
{#each posts as post}
  <a href={`${base}/${post.slug}`}>
    <h2 class="title">{post.metadata.title}</h2>
    <p>{post.metadata.excerpt}</p>
  </a>
{/each}
