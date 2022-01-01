<script lang="ts">
  import type { postType } from "$lib/posts";
  import { base } from "$app/paths";

  export let post: postType;
</script>

<a href={`${base}/${post.slug}`}>
  <div class="card">
    <div class="header">
      <h2>{post.title}</h2>
      <p>{post.date}</p>
    </div>
    <p class="excerpt">{@html post.excerpt}</p>
  </div>
</a>

<style>
  a {
    text-decoration: none;
    border-bottom: none;
    font-weight: 400;
  }
  a:hover h2 {
    text-decoration: underline;
  }
  .card {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }
  .header {
    display: flex;
    flex: 0 0 30%;
    flex-direction: column;
    margin-right: 1rem;
  }
  .header h2 {
    margin-block-end: 0rem;
    margin-block-start: 0rem;
    font-size: 1.25em;
  }
  .header p {
    font-size: 0.9em;
    margin-block-start: 0.5rem;
    color: var(--text-color-secondary);
  }
  @media (max-width: 640px) {
    .card {
      flex-direction: column;
    }
  }

  .excerpt {
    color: var(--text-color-secondary);
    margin-block-start: 0rem;
  }
</style>
