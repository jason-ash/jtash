<script context="module">
  import { base } from "$app/paths";

  export async function load({ page, fetch }) {
    const slug = page.params.slug;
    const post = await fetch(`${base}/${slug}.json`).then((r) => r.json());
    return {
      props: { post },
    };
  }
</script>

<script>
  export let post;
</script>

<h1 class="title">{post.metadata.title}</h1>
<p class="info">{post.metadata.date}</p>
{@html post.content}
