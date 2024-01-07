<script lang="ts">
	export let data;
</script>

{#if data.session}
	<pre>
		{JSON.stringify(data.session.user, null, 2)}
	</pre>
{:else}
	<!-- <form method="POST" use:enhance={handleLogin}>
		<button formaction="?/login&provider=discord" class="border">Sign In With Discord</button>
	</form> -->
{/if}
