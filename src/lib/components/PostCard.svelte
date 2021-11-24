<script lang="ts">
  import type { postType } from "$lib/posts";
  import { base } from "$app/paths";

  export let post: postType;
</script>

<div class="bg-purple-100">
  <a href={`${base}/${post.slug}`}>
    <h2 class="title">{post.title}</h2>
  </a>
  <p>{post.excerpt}</p>
</div>
