<script lang="ts">
	import {
		createAudioAnalyser,
		LocalAudioTrack,
		RemoteAudioTrack
	} from 'livekit-client';
	import { onDestroy, onMount } from 'svelte';

	export let track: LocalAudioTrack | RemoteAudioTrack;

	let interval: number;
	let volume = 100;
	let cleanup: () => void;

	onMount(() => {
		const audioAnalyser = createAudioAnalyser(track, {
			smoothingTimeConstant: 0.8,
			fftSize: 64
		});

		const analyser = audioAnalyser.analyser;
		cleanup = audioAnalyser.cleanup;

		let array = new Float32Array(analyser.fftSize);
		interval = setInterval(() => {
			analyser.getFloatTimeDomainData(array);

			let peakInstantaneousPower = 0;
			for (let i = 0; i < array.length; i++) {
				const power = array[i] ** 2;
				peakInstantaneousPower = Math.max(power, peakInstantaneousPower);
			}

			const db = 10 * Math.log10(peakInstantaneousPower);
			volume = Math.min(100, Math.max(0, Math.round(db + 100)));
		}, 100);
	});

	onDestroy(() => {
		clearInterval(interval);
		cleanup();
	});
</script>

<div class="volume-meter">
	<div class="volume-meter-bar" style={`--volume: ${volume}%`}></div>
</div>

<style>
	.volume-meter {
		position: relative;
		width: 100%;
		height: 1rem;
		border-radius: 0.5rem;
		background: rgba(0, 0, 0, 0.25);
	}

	.volume-meter-bar {
		position: absolute;
		top: 0;
		left: 0;
		width: var(--volume, 0%);
		height: 100%;
		border-radius: 0.5rem;
		background: linear-gradient(
			90deg,
			rgba(40, 143, 0, 1) 50%,
			rgba(255, 0, 0, 1) 100%
		);
		background-attachment: fixed;
		transition: 0.1s ease;
	}
</style>
