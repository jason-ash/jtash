<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";
  import type { postType } from "$lib/posts";
  import { base } from "$app/paths";

  export const load: Load = async ({
    fetch,
  }): Promise<{ props: { posts: postType[] } }> => {
    const posts = await fetch(`${base}/index.json`).then((r) => r.json());
    return { props: { posts } };
  };
</script>

<script lang="ts">
  import Hero from "../lib/components/Hero.svelte";
  import PostCard from "$lib/components/PostCard.svelte";

  export let posts: postType[];
</script>

<svelte:head>
  <title>Jason Ash - Thought Archive</title>
</svelte:head>

<Hero />
{#each posts as post}
  <PostCard {post} />
{/each}
