<script lang="ts">
  import type { postType } from "$lib/posts";
  import { formatDateString } from "$lib/posts";
  import { base } from "$app/paths";

  export let post: postType;
</script>

<a href={`${base}/${post.slug}`}>
  <div class="title">
    <h2>{post.title}</h2>
    <p>{formatDateString(post.date)}</p>
  </div>
  <p class="excerpt">{post.excerpt}</p>
</a>

<style>
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2rem;
  }
  a {
    text-decoration: none;
    border-bottom: none;
  }
  .title h2 {
    margin-block-end: 0.4rem;
    margin-block-start: 0.4rem;
  }
  .excerpt {
    margin-block-start: 0rem;
  }
</style>
