<script lang="ts">
  import type { postType } from "$lib/posts";
  import { base } from "$app/paths";

  export let post: postType;
</script>

<div class="my-4 p-4">
  <div class="mb-2 flex justify-between">
    <a href={`${base}/${post.slug}`}>
      <h2 class="title">{post.title}</h2>
    </a>
    <p>{post.date}</p>
  </div>
  <p>{post.excerpt}</p>
</div>
