<script lang="ts">
	import { Router, Route } from "svelte-navigator";
	import ComparatorPage from "./components/ComparatorPage/index.svelte";
	import Header from "./components/Header.svelte";
	import Footer from "./components/Footer.svelte";
</script>

<div class="container">
	<Router>
		<Header />
		<Route path="/" component={ComparatorPage} />
	</Router>
	<Footer />
</div>