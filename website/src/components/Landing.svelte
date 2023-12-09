<script lang="ts">
	import * as env from '$env/static/public';
</script>

<main>
	<h1>{env.PUBLIC_SERVER_NAME ?? 'Welcome'}</h1>
	<h2>Join the server voice chat</h2>

	<button on:click>Connect</button>
</main>
