<script>
  import "../app.css";
  import Nav from "../lib/components/Nav.svelte";
</script>

<svelte:head />

<div>
  <Nav />
  <slot />
</div>

<style>
  div {
    width: 100%;
    padding-left: 4rem;
    padding-right: 4rem;
    margin-left: auto;
    margin-right: auto;
  }
  @media (min-width: 576px) {
    div {
      width: 540px;
    }
  }
  @media (min-width: 768px) {
    div {
      width: 720px;
    }
  }
</style>
