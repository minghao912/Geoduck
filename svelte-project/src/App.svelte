<script lang="ts">
	import Input from "./Input.svelte";

	export let name: string;
	export let yeet: number;

	let testVal = 888;
	let testValStr = testVal as string;
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	
	<br />

	<p>This is a test: {yeet}</p>
	<Input />
	<Input value={testValStr} />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>