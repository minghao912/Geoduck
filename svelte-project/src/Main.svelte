<script lang="ts">
    import Input from './Input.svelte';
</script>

<main>
    <!-- Input Section -->
    <Input />

    <!-- Instructions -->
    <div class="container text-center">
        <div class="row my-2">
            <div class="col mx-3 full-size">
                <div class="card border-primary my-2 center-children">
                    <div class="card-header">
                        <h3>Instructions</h3>
                    </div>
                    <div class="card-body">
                        <p>
                            Start typing, and the output will appear in the other box.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    a {
	    text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
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