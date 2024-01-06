<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import {
		getMicrophones,
		type AudioInput,
		room,
		setMicrophone
	} from '../helper/livekit';
	import { ElementStore, elementstore } from '../stores/elements';
	import type { LocalStorageStore } from '../stores/localstorage';
	import { writable } from 'svelte/store';

	let opened = false;

	let elements: ElementStore;
	let settings: LocalStorageStore<{
		microphone: string;
		'hide-monitors': boolean;
	}>;

	let microphones: AudioInput[] = [];
	let hideMonitors = writable<boolean>(false);

	const toggle = () => {
		opened = !opened;
	};

	const onClickOutside = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (!target.closest('.container')) {
			opened = false;
		}
	};

	onMount(() => {
		document.addEventListener('click', onClickOutside);

		getMicrophones().then((devices) => {
			microphones = devices;

			elements = elementstore(['microphone', 'hide-monitors']);
			settings = elements.storable('settings');
			hideMonitors.set(settings.value['hide-monitors']);

			settings.subscribe((s) => {
				hideMonitors.set(s['hide-monitors']);
				setMicrophone($room!!, s.microphone);
			});
		});
	});

	onDestroy(() => {
		document.removeEventListener('click', onClickOutside);
	});
</script>

<div class="container">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="icon" on:click={toggle}>
		<i class="gg-options"></i>
	</div>

	<div class="options" data-open={opened}>
		<div class="option">
			<label for="microphone">Microphone</label>
			<select name="microphone" id="microphone">
				<option value="default">Default</option>
				{#each microphones as microphone}
					{#if !microphone.monitor || !$hideMonitors}
						<option value={microphone.details.deviceId}
							>{microphone.name}</option
						>
					{/if}
				{/each}
			</select>
		</div>
		<div class="option">
			<label for="hide-monitors">Hide monitors</label>
			<input type="checkbox" name="hide-monitors" id="hide-monitors" />
		</div>
	</div>
</div>

<style>
	.container {
		position: absolute;
		top: 2rem;
		right: 2rem;
	}

	.icon {
		padding: 1rem;
		color: #fff;
		cursor: pointer;
		--ggs: 1.5;
		float: right;
		transition: 0.2s ease;
	}

	.icon:hover {
		color: #ccc;
	}

	.options {
		clear: both;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 0.5rem;
		box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
		opacity: 0;
		pointer-events: none;
		transition: 0.2s ease;
		padding: 1rem 1.25rem;
		color: #222;

		min-width: 10rem;
		min-height: 1rem;

		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.options[data-open='true'] {
		opacity: 1;
		pointer-events: all;
		min-height: 10rem;
		transform: translateY(10px);
	}

	.option {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
	}

	label {
		user-select: none;
	}

	select {
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid #ccc;
		background: #fff;
		color: #222;
	}
</style>
