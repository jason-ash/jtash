<script lang="ts">
  import type { postType } from "$lib/posts";

  export let post: postType;
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.1/styles/github.min.css"
  />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css"
    integrity="sha384-R4558gYOUz8mP9YWpZJjofhk+zx0AS11p36HnD2ZKj/6JR5z27gSSULCNHIRReVs"
    crossorigin="anonymous"
  />
  <script
    defer
    src="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.js"
    integrity="sha384-z1fJDqw8ZApjGO3/unPWUPsIymfsJmyrDVWC8Tv/a1HeOtGmkwNd/7xUS0Xcnvsx"
    crossorigin="anonymous">
  </script>
  <style>
    .katex {
      font-size: 1.05em !important;
    }
  </style>
</svelte:head>

<div>
  <div class="title">
    <h1>{post.title}</h1>
    <p>{post.date}</p>
  </div>
  <hr />
  <div class="post">
    {@html post.content}
  </div>
</div>

<style>
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
  }
  .title h1 {
    margin-block-start: 0.1em;
  }
  .post :global(h1) {
    font-size: 1.5em;
  }
  .post :global(blockquote) {
    font-style: italic;
    color: #404040;
    border-left-width: 0.2rem;
    border-left-style: solid;
    border-left-color: #d4d4d4;
    padding-left: 1rem;
    max-width: 90%;
    display: block;
    margin: auto;
  }
  .post :global(pre) {
    border-left-width: 0.2rem;
    border-left-style: solid;
    border-left-color: #d4d4d4;
    display: block;
    margin: auto;
    max-width: 90%;
  }
  .post :global(img) {
    display: block;
    margin: auto;
    max-width: 90%;
    max-height: 100%;
  }
</style>
