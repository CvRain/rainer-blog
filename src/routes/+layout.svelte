<script lang="ts">
	import '../app.css';
    import {ModeWatcher} from "mode-watcher";
	import NavFooter from '$lib/components/nav-footer.svelte';
	let { children } = $props();
</script>

<ModeWatcher/>
<div class="flex min-h-screen flex-col">
	{@render children()}
	<NavFooter />
</div>
