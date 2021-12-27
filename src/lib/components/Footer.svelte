<script>
  export let currentYear = new Date().getFullYear();
</script>

<hr />
<footer>
  <ul>
    <li>
      <a href="https://github.com/jason-ash/jtash">Open Source</a> and built with
      <a href="https://kit.svelte.dev/">SvelteKit</a>.
      <br />
      <span class="copyright">&copy; {currentYear} Jason Ash. All rights reserved.</span>
    </li>
  </ul>
  <ul>
    <li><a href="https://github.com/jason-ash">Github</a></li>
    <li><a href="https://twitter.com/ashjasont">Twitter</a></li>
    <li><a href="https://www.linkedin.com/in/jason-ash/">LinkedIn</a></li>
  </ul>
</footer>

<style>
  footer {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  li {
    display: inline;
    text-align: center;
  }
  li:not(:last-child) {
    padding-right: 1.5rem;
  }
  .copyright {
    color: var(--text-color-secondary);
  }
</style>
