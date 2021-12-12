<script lang="ts">
  import type { postType } from "$lib/posts";
  import { formatDateString } from "$lib/posts";
  import { base } from "$app/paths";

  export let post: postType;
</script>

<div>
  <div class="title">
    <a href={`${base}/${post.slug}`}>
      <h2>{post.title}</h2>
    </a>
    <p>{formatDateString(post.date)}</p>
  </div>
  <p class="excerpt">{post.excerpt}</p>
</div>

<style>
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2rem;
  }
  .title a {
    text-decoration: none;
  }
  .title h2 {
    margin-block-end: 0.4rem;
    margin-block-start: 0.4rem;
  }
  .excerpt {
    margin-block-start: 0rem;
  }
</style>
