<script lang="ts">
	import { user } from '../helper/user';
</script>

<main>
	<img
		src="https://minotar.net/armor/bust/{$user?.uuid}/100.png"
		alt="Minecraft Bust Avatar for {$user?.username}"
	/>
	<h1>Welcome, {$user?.username}</h1>
	<h2>You are currently connected to voice chat!</h2>
</main>
