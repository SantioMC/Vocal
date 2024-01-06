<script lang="ts">
	import { localTrack } from '../helper/livekit';
	import { user } from '../helper/user';
	import Options from './Options.svelte';
	import VolumeMeter from './VolumeMeter.svelte';
</script>

<Options />
<main>
	<img
		src="https://skins.mcstats.com/bust/{$user?.uuid}"
		alt="Minecraft Bust Avatar for {$user?.username}"
	/>

	<div class="text">
		<h1>Welcome, {$user?.username}</h1>
		<h2>You are currently connected to voice chat!</h2>
		{#if $localTrack}
			<VolumeMeter track={$localTrack} />
		{/if}
	</div>
</main>

<style>
	h1 {
		font-size: 2em;
	}

	h2 {
		font-size: 1.5em;
		margin-bottom: 0.5rem;
	}

	.text {
		display: flex;
		flex-direction: column;
	}

	main {
		width: 40%;
		margin: 0 auto;
		position: relative;
		display: flex;
		align-items: center;
		flex-direction: row;
	}

	img {
		width: 256px;
		height: 256px;
		z-index: -1;
	}

	@media (max-width: 1024px) {
		main {
			width: 60%;
		}
	}

	@media (max-width: 768px) {
		main {
			width: 80%;
		}
	}

	@media (max-width: 480px) {
		main {
			flex-direction: column;
			font-size: 0.8rem;
			gap: 1rem;
		}

		img {
			width: 192px;
			height: 192px;
		}
	}
</style>
