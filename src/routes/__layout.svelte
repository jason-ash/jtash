<script>
  import "../app.css";
  import Nav from "../lib/components/Nav.svelte";
</script>

<div class="container max-w-3xl mx-auto font-sans">
  <Nav />
  <slot />
</div>
