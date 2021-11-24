<script context="module" lang="ts">
  import type { postType } from "$lib/posts";
  import { base } from "$app/paths";

  export const load = async ({ fetch }): Promise<{ props: { posts: postType[] } }> => {
    const posts = await fetch(`${base}/index.json`).then((r) => r.json());
    return { props: { posts } };
  };
</script>

<script lang="ts">
  import PostCard from "$lib/components/PostCard.svelte";
  import Hero from "../lib/components/Hero.svelte";

  export let posts: postType[];
  console.log(posts);
</script>

<Hero />
{#each posts as post}
  <PostCard {post} />
{/each}
