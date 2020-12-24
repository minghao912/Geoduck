<script lang="ts">
    // Syntax highlighting
    const highlight = () => {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }
</script>

<svelte:head>
    <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/highlight.min.js" on:load={highlight}></script>
</svelte:head>

<main>
    <div class="container text-container" style="margin-bottom: 60px;">
        <div class="row mt-3 mb-2 center-children" id="intro">
            <div class="col mx-2">
                <p>Requests can be made directly via HTTP or HTTPS. The server responds to GET requests to:<br />
                <samp>http[s]://node.dragonfruit.tk/panda_linux/&lt;direction&gt;?query=&lt;query&gt;</samp>
                </p>
            </div>
        </div>

        <div class="row mb-10" id="code-examples">
            <div class="col mx-2">
                <div class="row">
                    <h2>API Format</h2>
                </div>
                <div class="row mt-1 mb-4" id="server-formatting">
                    <div class="col mx-2">
                        <div class="card">
                            <div class="card-header">Valid Directions</div>
                            <div class="card-body bg-code">
                                <pre><code class="language-ts">
<!--                             -->enum Direction &lbrace;
<!--                             -->    s2t = "s2t",    // Simplified to Traditional
<!--                             -->    s2t = "t2s",    // Traditional to Simplified
<!--                             -->&rbrace;
                                </code></pre>
                            </div>
                        </div>
                    </div>
                    <div class="col mx-2">
                        <div class="card">
                            <div class="card-header">Response Format</div>
                            <div class="card-body bg-code">
                                <pre><code class="language-ts">
<!--                             -->&lbrace;
<!--                             -->    "original": string,
<!--                             -->    "conversion": string
<!--                             -->&rbrace;
                                </code></pre>
                            </div>
                        </div>
                    </div>
                    <div class="col mx-2">
                        <div class="card">
                            <div class="card-header">Example</div>
                            <div class="card-body bg-code">
                                <pre><code class="language-ts">
<!--                             -->&lbrace;
<!--                             -->    "original": "汉字",
<!--                             -->    "conversion": "漢字"
<!--                             -->&rbrace;
                                </code></pre>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <h2>Usage Examples</h2>
                </div>
                <div class="row mt-1 mb-2" id="https">
                    <div class="col mx-2">
                        <div class="card">
                            <div class="card-header">Valid URL</div>
                            <div class="card-body bg-code">
                                <pre><code class="plaintext">
<!--                             -->https://node.dragonfruit.tk/panda_linux/s2t?query=汉字
                                </code></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mt-1 mb-2" id="https">
                    <div class="col mx-2">
                        <div class="card">
                            <div class="card-header">HTTPS (TypeScript)</div>
                            <div class="card-body bg-code">
                                <pre><code class="language-ts">
<!--                             -->function convert(direction: Direction, query: string) &lbrace;
<!--                             -->    let url = `https://node.dragonfruit.tk/panda_linux/${'{direction}'}?query=${'{query}'}`;
<!--                             -->    fetch(url).then(response =&gt; &lbrace;
<!--                             -->        response.json().then(p =&gt; &lbrace;
<!--                             -->            console.log("Original query: " + p.original);
<!--                             -->            console.log("Converted: " + p.conversion);
<!--                             -->        &rbrace;)
<!--                             -->    &rbrace;);
<!--                             -->&rbrace;
                                </code></pre>
                            </div>
                        </div>
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

    footer > * {
        display: inline-block;
    }

    .bg-code {
        background-color: #1d1f21 !important;
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