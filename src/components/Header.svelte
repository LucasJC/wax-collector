<script lang="ts">
  import { link, useLocation } from "svelte-navigator";
  const location = useLocation();
  let isMenuActive = false;
</script>

<section id="header" class="hero">
  <div class="hero-body">
    <p class="title">
      WAX Collector
    </p>
  </div>
  <!--
  <nav class="navbar hero-body" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="column">
        <p class="title">
          WAX Collector
        </p>
        <p class="subtitle">
        </p>
      </div>    
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        class:is-active={isMenuActive}
        on:click={() => (isMenuActive = !isMenuActive)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>
    <div class="navbar-menu" class:is-active={isMenuActive} on:click={() => (isMenuActive = !isMenuActive)}>
      <div class="navbar-start"></div>
      <div class="navbar-end">
        <a class="navbar-item" class:is-active={$location.pathname === "/"} href="/" use:link>
          Home
        </a>
        <a class="navbar-item" class:is-active={$location.pathname === "/compare-accounts"} href="/compare-accounts" use:link>
          Compare Accounts
        </a>
      </div>
    </div>
  </nav> -->
</section>