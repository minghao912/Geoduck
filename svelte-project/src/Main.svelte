<script lang="ts">
    import Input from './Input.svelte';
</script>

<svelte:head>
    <!-- link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" -->
</svelte:head>

<main>
    <header class="bg-dark text-center p-2 mb-3">
        <h1 class="my-3 text-white">PandaCC</h1>
    </header>

    <Input />

    <div class="container text-center">
        <div class="row my-3">
            <div class="col mx-3 full-size">
                <div class="card border-primary my-3 center-children">
                    <div class="card-header">
                        <h3>Instructions</h3>
                    </div>
                    <div class="card-body">
                        <p>
                            Start typing, and the output should be in the other box.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <footer class="bg-dark text-center p-2 mt-3">
        <a class ="my-2 text-white" href="https://github.com/minghao912/PandaCC">Github</a>
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
        width:100%;
        position: fixed;
        bottom: 0;
    }

    .center-children {
        text-align: center;
        align-content: center;
    }

    .full-size {
        width: 100%;
        height: 100%;
        min-height: 100%;
    }
</style>