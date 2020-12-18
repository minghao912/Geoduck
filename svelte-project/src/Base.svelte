<script lang="ts">
    import Main from './Main.svelte';
    import API from './API.svelte';

    let showAPI = false;
    function renderAPI(): void {
        showAPI = true;
    }

    function renderMain(): void {
        showAPI = false;
    }

    $: {
        if (showAPI)
            console.log("> showAPI is true");
        else console.log("> showAPI is false");
    }
</script>

<main>
    <header class="bg-dark text-center p-2 mb-3">
        <h1 class="my-3 text-white">PandaCC</h1>
    </header>

    {#if showAPI}
        <API />
        <div class="row my-3" style="width:100%; justify-content:center;">
            <button class="btn btn-secondary" on:click={renderMain}>Main Page</button>
        </div>
    {:else}
        <Main />
    {/if}

    <footer class="bg-dark text-center p-2 mt-3">
        {#if !showAPI}
            <p class="my-2 text-white p-link" on:click={renderAPI}>API</p>
        {/if}
        <a class="my-2 text-white" href="https://github.com/minghao912/PandaCC">Github</a>
    </footer>
</main>

<style>
    a {
	    text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    footer {
        display: flex;
        justify-content: space-around;
        width:100%;
        position: fixed;
        bottom: 0;
    }

    footer > * {
        display: inline-block;
    }

    .p-link {
	    text-decoration: none;
    }

    .p-link:hover {
        cursor: pointer;
        text-decoration: underline;
    }
</style>