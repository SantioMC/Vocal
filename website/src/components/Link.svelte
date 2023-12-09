<script lang="ts">
	import * as env from '$env/static/public';
	import { createEventDispatcher, onMount } from 'svelte';
	import { connectSocket, isConnecting } from '../helper/socket';

	const dispatcher = createEventDispatcher<{
		connected: void;
	}>();

	let code = '';

	onMount(() => {
		fetch(env.PUBLIC_API_URL + '/connect', {
			method: 'POST'
		})
			.then((res) => res.json())
			.then((data) => {
				code = data.code;
				connect();
			})
			.catch((err) => {
				console.error(err);
			});
	});

	const connect = () => {
		console.log('Connecting to socket and waiting for verification...');
		connectSocket(code, () => {
			dispatcher('connected');
		});
	};

	const selectText = (e: Event) => {
		const elem = e.target as HTMLElement;
		const range = document.createRange();
		range.selectNodeContents(elem);
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	};
</script>

<main>
	<h1>Link your account</h1>
	<h2>Run the following command to link your account</h2>

	{#if $isConnecting}
		<code class="disabled">Establishing connection...</code>
	{:else if code === ''}
		<code class="disabled">/vocal link ...</code>
	{:else}
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<code on:click={selectText}>/vocal link {code}</code>
	{/if}
</main>
