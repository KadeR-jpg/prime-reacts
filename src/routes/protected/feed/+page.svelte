<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { PageData } from './$types';
	export let data: PageData;
	import Card from '$lib/Components/Card.svelte';
	import NewCard from '$lib/Components/NewCard.svelte';
	import { PlusCircle } from 'lucide-svelte';
	let showNewCard: boolean = true;
	type Post = {
		content: string;
		created_at: string;
		downvotes: number;
		upvotes: number;
		id: number;
		posted_by: string;
		title: string;
		url: string;
		user_id: string;
	};
	type VoteType = 'upvote' | 'downvote';
	async function voteOnPost(userId: string, postId: number, vote_direction: VoteType) {
		const { data: existingVote, error: existingVoteError } = await supabase
			.from('votes')
			.select('*')
			.eq('user_id', userId)
			.eq('post_id', postId)
			.single();
		if (existingVoteError) {
			// Check if it's the "no rows" error, if so, treat as no vote found
			if (
				existingVoteError.code !== 'PGRST116' ||
				existingVoteError.details !== 'The result contains 0 rows'
			) {
				console.error('Error fetching existing vote:', existingVoteError);
				return;
			}
		}
		if (existingVote) {
			/**
			 * If a user has already voted on a post with the same vote_direction then vote will be removed
			 * otherwise the vote 'other' type of vote will be  added.
			 */
			if (
				(existingVote.vote_type === true && vote_direction === 'upvote') ||
				(existingVote.vote_type === false && vote_direction === 'downvote')
			) {
				if (vote_direction === 'upvote') {
					/**
					 * decrement upvote
					 * else: decrement downvote
					 */
					await supabase.rpc('decrement_upvote', { post_id: postId });
				} else {
					await supabase.rpc('decrement_downvote', { post_id: postId });
				}
				/**
				 * vote is removed but now the client side vote needs to be updated
				 * in real time hopefully
				 */
				await supabase.from('votes').delete().match({ id: existingVote.id });
			} else {
				await supabase.rpc('flip_vote', {
					p_id: postId,
					u_id: userId,
					new_vote: vote_direction === 'upvote' ? true : false
				});
			}
		} else {
			/**
			 * In this case the user has not voted on a post yet
			 * Handle that
			 */
			await supabase.from('votes').insert({
				post_id: postId,
				user_id: userId,
				vote_type: vote_direction === 'upvote' ? true : false
			});
			if (vote_direction === 'upvote') {
				await supabase.rpc('increment_upvote', { post_id: postId });
			} else {
				await supabase.rpc('increment_downvote', { post_id: postId });
			}
		}
	}
	function handleVote(event) {
		const { direction, post_id } = event.detail;
		voteOnPost(data.session?.user.id, post_id, direction);
	}

	let posts: Post[] = [];

	onMount(async () => {
		const { data, error } = await supabase.from('posts').select('*');
		if (error) {
			console.log('error fetching posts');
		} else {
			posts = data;
		}
	});
	const channel = supabase
		.channel('table_db_changes')
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'posts'
			},
			(payload) => {
				const updated_post: Post = payload.new as Post;
				const post_index = posts.findIndex((p) => p.id === updated_post.id);
				if (post_index !== -1) {
					posts[post_index] = updated_post;
					posts = posts;
				}
			}
		)
		.subscribe();
	onDestroy(() => {
		supabase.removeChannel(channel);
	});
</script>

<div class="flex flex-col">
	{#if posts.length > 0}
		<div>
			{#each posts as post}
				<Card
					on:vote={handleVote}
					{...post}
					created_at={Intl.DateTimeFormat().format(Date.parse(post.created_at))}
				/>
			{/each}
		</div>
	{:else}
		<p>No Posts are available</p>
	{/if}
	<NewCard bind:showNewCard />
	<button on:click={() => (showNewCard = true)} class="absolute bottom-0 right-0 p-4 rounded-full">
		<PlusCircle
			size="64"
			strokeWidth="1"
			class="hover:scale-125 transition-all ease-in duration-75 stroke-orange-600"
		/>
	</button>
</div>
