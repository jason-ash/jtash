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
  import PostLayout from "$lib/components/PostLayout.svelte";
  import TwitterSummaryCard from "$lib/components/SEO/TwitterSummaryCard.svelte";
  export let post: postType;
  console.log(post);
</script>

<TwitterSummaryCard {post} />
<PostLayout {post} />
