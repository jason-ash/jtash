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
  <p class="excerpt">{@html post.excerpt}</p>
</a>

<style>
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }
  a {
    text-decoration: none;
    border-bottom: none;
  }
  a:hover h2 {
    text-decoration: underline;
  }
  .title h2 {
    margin-block-end: 0rem;
    margin-block-start: 0rem;
  }
  .title p {
    font-weight: 400;
  }
  .excerpt {
    font-weight: 400;
    margin-block-start: 0rem;
    hyphens: auto;
  }
</style>
