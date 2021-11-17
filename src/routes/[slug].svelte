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

<h1 class="title">{post.title}</h1>
<p class="info">{post.date}</p>
{@html post.content}
