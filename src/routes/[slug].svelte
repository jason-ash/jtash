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
  import PostLayout from "$lib/components/PostLayout.svelte";
  export let post: postType;
</script>

<PostLayout {post} />
