<script lang="ts">
    import Main from './Main.svelte';
    import API from './API.svelte';
    import * as constants from './constants';

    // Switch "pages"
    let pageToShow = constants.Page.MAIN;
    function renderAPI(): void {
        pageToShow = constants.Page.API;
    }
    function renderMain(): void {
        pageToShow = constants.Page.MAIN;
    }

    // Switch language
    let langToShow = constants.Lang.CHINESE;
    function changeLang(): void {
        if (langToShow == constants.Lang.CHINESE) langToShow = constants.Lang.ENGLISH;
        else langToShow = constants.Lang.CHINESE;
    }

    $: console.log("> Show page " + pageToShow);
    $: console.log("> Show lang " + langToShow);
</script>

<main>
    <header class="bg-dark text-center p-2 mb-3">
        <h1 class="my-3 text-white">PandaCC</h1>
    </header>

    <!-- Show "page" content -->
    {#if pageToShow == constants.Page.API}
        <API />

        <!-- Button to return to Main Page -->
        <div class="container float pointer-hover" on:click={renderMain}>
            <span><i class="centered-item fas fa-home fa-2x"></i></span>
        </div>

    {:else if pageToShow == constants.Page.MAIN}
        <Main lang={langToShow}/>
    {:else}
        <div class="row my-5" style="width:100%; justify-content:center;">
            <h1>404 Content Not Found</h1>
        </div>
    {/if}

    <!-- Change language button -->
    {#if pageToShow == constants.Page.MAIN}
        <div class="container float pointer-hover" on:click={changeLang}>
            <span class={langToShow == constants.Lang.CHINESE ? "icon-en centered-item" : "icon-cn centered-item"}></span>
        </div>
    {/if}

    <footer class="bg-dark text-center p-2 mt-3">
        {#if pageToShow != constants.Page.API}
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

    .centered-item {
        position: absolute;
        top: 50%;
        left: 50%;
        -moz-transform: translateX(-50%) translateY(-50%);
        -webkit-transform: translateX(-50%) translateY(-50%);
        transform: translateX(-50%) translateY(-50%);
    }

    .float {
        position: fixed;
        width: 60px;
        height: 60px;
        bottom: 80px;
        right: 40px;
        background-color: #292929;
        color: ghostwhite;
        border-radius: 50px;
        text-align: center;
        padding-top: 2.5vw;
        box-shadow: 2px 2px 3px #999
    }

    .icon-cn {
        background-image: url("icon/cn.svg");
        height: 32px;
        width: 32px;
        display: block;
    }

    .icon-en {
        background-image: url("icon/en.svg");
        height: 32px;
        width: 32px;
        display: block;
    }

    .p-link {
	    text-decoration: none;
    }

    .p-link:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    .pointer-hover:hover {
        cursor: pointer;
    }
</style>