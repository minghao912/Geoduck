<script lang="ts">
    import Main from './Main.svelte';
    import API from './API.svelte';

    // Switch "pages"
    enum Page {
        MAIN = "MAIN",
        API = "API"
    };

    let pageToShow = Page.MAIN;
    function renderAPI(): void {
        pageToShow = Page.API;
    }
    function renderMain(): void {
        pageToShow = Page.MAIN;
    }

    $: console.log("> Show page " + pageToShow);
</script>

<main>
    <header class="bg-dark text-center p-2 mb-3">
        <h1 class="my-3 text-white">PandaCC</h1>
    </header>

    <!-- Show "page" content -->
    {#if pageToShow == Page.API}
        <API />

        <!-- Button to return to Main Page -->
        <div class="container text-center">
            <div class="row my-3">
                <div class="col mx-2 center-children">
                    <button class="btn btn-secondary" on:click={renderMain}>Main Page</button>
                </div>
            </div>
        </div>
    {:else if pageToShow == Page.MAIN}
        <Main />
    {:else}
        <div class="row my-5" style="width:100%; justify-content:center;">
            <h1>404 Content Not Found</h1>
        </div>
    {/if}

    <footer class="bg-dark text-center p-2 mt-3">
        {#if pageToShow != Page.API}
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

    .center-children {
        text-align: center;
        justify-content: center;
        align-content: center;
    }

    .p-link {
	    text-decoration: none;
    }

    .p-link:hover {
        cursor: pointer;
        text-decoration: underline;
    }
</style>