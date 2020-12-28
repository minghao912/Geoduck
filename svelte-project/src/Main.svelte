<script lang="ts">
    import Input from './Input.svelte';
    import * as constants from './constants';

    export let lang: constants.Lang = constants.Lang.CHINESE;
</script>

<main>
    <!-- Input Section -->
    <Input lang={lang}/>

    <!-- Instructions -->
    <div class="container text-center">
        <div class="row mt-2 d-flex">
            <div class="col mx-3 full-size">
                <div class="card border-primary mt-2 center-children" id="instructions-card">
                    <div class="card-header">
                        <h3>
                            {#if lang == constants.Lang.ENGLISH}
                                Instructions
                            {:else if lang == constants.Lang.CHINESE}
                                使用说明
                            {/if}
                        </h3>
                    </div>
                    <div class="card-body">
                        <p>
                            {#if lang == constants.Lang.ENGLISH}
                                Start typing, and the output will appear in the other box.
                            {:else if lang == constants.Lang.CHINESE}
                                在其中一个文本区开始输入，翻译会在对面显示
                            {/if}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    .center-children {
        text-align: center;
        align-content: center;
    }

    .full-size {
        width: 100%;
        height: 100%;
        min-height: 100%;
        min-width: 80%;
    }

    #instructions-card {
        margin: auto;
        width: 100%;
    }
</style>