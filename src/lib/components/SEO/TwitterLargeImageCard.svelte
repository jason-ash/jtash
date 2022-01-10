<script lang="ts">
  import type { postType } from "$lib/posts";

  export const titleLength = 70;
  export const descriptionLength = 200;

  export let post: postType;
</script>

<svelte:head>
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ashjasont" />
  <meta name="twitter:creator" content="@ashjasont" />
  <meta name="twitter:title" content={post.title.slice(0, titleLength)} />
  <meta name="twitter:description" content={post.excerpt.slice(0, descriptionLength)} />
  <meta name="twitter:image" content={post.featuredImage} />
  <!-- <meta name="twitter:image:alt" content="headshot" /> -->
</svelte:head>
