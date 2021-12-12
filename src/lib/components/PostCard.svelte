<script lang="ts">
  import type { postType } from "$lib/posts";
  import { base } from "$app/paths";

  export let post: postType;
</script>

<div>
  <div class="title">
    <a href={`${base}/${post.slug}`}>
      <h2>{post.title}</h2>
    </a>
    <p>{post.date}</p>
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
  .excerpt {
    margin-block-start: 0rem;
  }
</style>
