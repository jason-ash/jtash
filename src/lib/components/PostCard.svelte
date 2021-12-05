<script lang="ts">
  import type { postType } from "$lib/posts";
  import { base } from "$app/paths";

  export let post: postType;
</script>

<div>
  <div>
    <a href={`${base}/${post.slug}`}>
      <h2>{post.title}</h2>
    </a>
    <p>{post.date}</p>
  </div>
  <p>{post.excerpt}</p>
</div>
