<script lang="ts">
	import '../app.postcss';
	// import '@picocss/pico';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { Provider } from '@supabase/supabase-js';
	import type { LayoutData } from './$types';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	export let data: LayoutData;
	$: ({ session, supabase } = data);
	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => subscription.unsubscribe();
	});
	const handleLoginWithDiscord = async (provider: Provider) => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'discord'
		});
		if (error) {
			console.log(error);
		}
	};
	const handleLogin: SubmitFunction = async ({ action, cancel }) => {
		handleLoginWithDiscord(action.searchParams.get('provider') as Provider);
		cancel();
	};
	const handleSignOut: SubmitFunction = async ({ cancel }) => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.log(error);
		}
		cancel();
	};
</script>

<main class="flex flex-col p-4">
	<header class="flex flex-row border justify-between items-center rounded p-4">
		<h1 class="inline-flex">(your name) reacts</h1>
		<nav class="flex flex-row gap-4 items-center">
			<a href="/">Home</a>
			<a href="/protected/feed">Feed</a>
			{#if data.session}
				<img
					src={data.session.user.user_metadata.avatar_url}
					alt="avatar url"
					class="h-8 rounded-full"
				/>
				<form action="/logout" method="POST" use:enhance={handleSignOut}>
					<button type="submit">logout</button>
				</form>
			{:else}
				<form method="POST" use:enhance={handleLogin}>
					<button formaction="?/login&provider=discord" class="border">Sign In With Discord</button>
				</form>
			{/if}
		</nav>
	</header>
	<slot {data} />
</main>

<!-- <style>
	main {
		padding: 2rem;
	}
</style> -->
