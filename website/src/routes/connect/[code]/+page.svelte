<script lang="ts">
	import { getMessage } from '../../../stores/message';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import * as env from '$env/static/public';
	import { connectSocket } from '../../../helper/socket';
	import { user } from '../../../helper/user';
	import { goto } from '$app/navigation';

	let message: string = '';
	export let data: PageData;

	onMount(async () => {
		message = await getMessage();
		await connectSocket(data.code).catch((e) => {
			console.error(e);
			return;
		});

		fetch(env.PUBLIC_API_URL + `/connect/${data.code}?uuid=${data.uuid}`, {
			method: 'POST'
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) message = data.message;
				user.set(data.player);
				goto('/', {
					replaceState: false
				});
			})
			.catch((err) => {
				console.error(err);
			});
	});
</script>

<main>
	<h1>{message}</h1>
</main>
