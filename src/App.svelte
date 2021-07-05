<script lang="ts">
	import { Router, Route } from "svelte-navigator";
	import { GoogleAnalytics } from "@beyonk/svelte-google-analytics";
	import ComparatorPage from "./components/ComparatorPage/index.svelte";
	import Header from "./components/Header.svelte";
	import Footer from "./components/Footer.svelte";
</script>

<GoogleAnalytics properties={["G-7RZDJEMHFR"]} />
<div class="container">
	<Router>
		<Header />
		<Route path="/" component={ComparatorPage} />
	</Router>
	<Footer />
</div>