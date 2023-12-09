<script lang="ts">
	import Dashboard from '../components/Dashboard.svelte';
	import Landing from '../components/Landing.svelte';
	import Link from '../components/Link.svelte';
	import { user } from '../helper/user';

	let stage = $user != null ? 'connected' : 'landing';

	const switchStage = (newStage: string) => () => {
		stage = newStage;
	};
</script>

{#if stage == 'landing'}
	<Landing on:click={switchStage('link')} />
{:else if stage == 'link'}
	<Link on:connected={switchStage('connected')} />
{:else if stage == 'connected'}
	<Dashboard />
{/if}
