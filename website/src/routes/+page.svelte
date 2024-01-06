<script lang="ts">
	import Dashboard from '../components/Dashboard.svelte';
	import Landing from '../components/Landing.svelte';
	import Link from '../components/Link.svelte';
	import { publishMicrophone, room } from '../helper/livekit';
	import { user } from '../helper/user';

	let stage = $user != null ? 'connected' : 'landing';

	if ($user && $room && !$room.localParticipant.isMicrophoneEnabled) {
		publishMicrophone($room);
	}

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
