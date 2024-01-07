<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	const dispatch = createEventDispatcher();
	function upvote() {
		dispatch('vote', { direction: 'upvote', post_id: id });
	}
	function downvote() {
		dispatch('vote', { direction: 'downvote', post_id: id });
	}
	export let title: string;
	export let id: number;
	export let user_id: string;
	export let posted_by: string;
	export let content: string;
	export let created_at: string;
	export let url: string;
	export let upvotes: number;
	export let downvotes: number;
	import { ArrowUpCircle, ArrowDownCircle } from 'lucide-svelte';
</script>

<div class="flex flex-col border rounded shadow-sm border-black p-4 m-4">
	<div class="flex flex-row justify-between items-baseline border-b-2 pb-1 mb-1 border-gray-200">
		<div class="flex flex-col">
			<h1 class="text-3xl">{title}</h1>
			<h2>{content}</h2>
		</div>
		<h3 class="text-sm text-gray-500">
			Posted by: {posted_by} on {created_at}
		</h3>
	</div>
	<a href={url}>{url}</a>
	<div class="inline-flex justify-end gap-12 pt-2">
		<div class="inline-flex gap-2">
			<button on:click={upvote}>
				<ArrowUpCircle
					class="hover:scale-110 hover:stroke-green-400 transition-all ease-in duration-75"
				/>
			</button>
			<p transition:slide>{upvotes}</p>
		</div>
		<div class="inline-flex gap-2">
			<button on:click={downvote}>
				<ArrowDownCircle
					class="hover:scale-110 hover:stroke-red-400 transition-all ease-in duration-75"
				/>
			</button>
			{downvotes}
		</div>
	</div>
</div>
