<script>
  import "../app.css";
  import Footer from "../lib/components/Footer.svelte";
  import Nav from "../lib/components/Nav.svelte";
</script>

<div class="container">
  <Nav />
  <slot />
  <Footer />
</div>
