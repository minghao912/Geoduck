<script lang="ts">

</script>

<main>
    <div class="container text-container">
        <div class="row my-3 center-children" id="intro">
            <div class="col mx-2">
                <p>Requests can be made directly via HTTP or HTTPS. The server responds to GET requests to:
                <samp>http[s]://node.dragonfruit.tk/panda_linux/&lt;direction&gt;?query=&lt;query&gt;</samp>
                </p>
                <p>The server responds with an object in the following format:</p>

            </div>
        </div>

        <div class="row my-3 center-children" id="code-examples">
            <div class="col mx-2">
                <div class="row my-2">
                    <div class="col mx-2">
                        <div class="card bg-secondary">
                            <div class="card-header">HTTP</div>
                            <div class="card-body">
                                <pre><code class="language-js">
                                    import * as http from 'http';
                                    http.get('http://node.dragonfruit.tk:/panda_linux/s2t?query=你好吗', (response) =&gt; {'{...}'}
                                </code></pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <pre><code class="language-js">
            import * as http from 'http';
            http.get('http://node.dragonfruit.tk:/panda_linux/s2t?query=你好吗', (response) =&gt; {'{...}'}
        </code></pre>
    </div>
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

    footer > * {
        display: inline-block;
    }

    .center-children {
        text-align: center;
        justify-content: center;
        align-content: center;
    }

    .full-size {
        width: 100%;
        height: 100%;
        min-height: 100%;
    }
</style>