<script lang="ts">
	export let showNewCard: boolean; // boolean

	let dialog: HTMLDialogElement; // HTMLDialogElement

	$: if (dialog && showNewCard) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	class="bg-transparent"
	bind:this={dialog}
	on:close={() => (showNewCard = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click|stopPropagation
		class="flex flex-col border rounded-2xl bg-neutral-50 border-neutral-400"
	>
		<header>Create A New Post</header>
		<form action="" class="flex flex-col">
			<label for="title" class="pr-1">URL</label>
			<input type="text" class="border border-neutral-300" />
			<label for="title">Title</label>
			<input type="text" class="border border-neutral-300" />
			<label for="title">Tag Line</label>
			<input type="text" class="border border-neutral-300" />
		</form>
		<!-- svelte-ignore a11y-autofocus -->
		<button autofocus on:click={() => dialog.close()}>close modal</button>
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	input {
		border-radius: 5px;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
