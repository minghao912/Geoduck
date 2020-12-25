<script lang="ts">
    import * as communicator from './communicator';
    import * as constants from './constants';

    export let lang: constants.Lang = constants.Lang.CHINESE;

    let placeholder: string;
    $: {
        placeholder = (function() {
            if (lang == constants.Lang.CHINESE)
                return "在此输入";
            else return "Start typing...";
        })();
    }

    // Takes the input and sends it to the server
    // Timeout stuff makes it so that it only runs the conversion when user stops typing for specified delay
    let timeout = null;
    const DELAY = 500;
    function handleInput(e: Event): void {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            const textarea = e.target as HTMLTextAreaElement
            console.log("> Text input detected in textarea with id " + textarea.id);

            switch (textarea.id) {
                case "simp":
                    communicator.convert(communicator.Direction.s2t, textarea.value).then(output => setOutput(textarea, output));
                    break;
                case "trad":
                    communicator.convert(communicator.Direction.t2s, textarea.value).then(output => setOutput(textarea, output));
                    break;
                default:
                    textarea.value = "There was an error parsing your text."
                    break;
            }
        }, DELAY);
    }

    // Takes the output and sets it in the other text box
    function setOutput(textarea: HTMLTextAreaElement, str: string): void {
        // Get other textarea
        let textareaToSwitch: HTMLTextAreaElement;
        switch(textarea.id) {
            case "simp":
                textareaToSwitch = document.getElementById("trad") as HTMLTextAreaElement;
                break;
            case "trad":
                textareaToSwitch = document.getElementById("simp") as HTMLTextAreaElement;
                break;
            default:
                textarea.value = "There was an error parsing your text."
                break;
        }

        // Change color and set output
        textarea.style.color = null;
        textareaToSwitch.style.color = "SteelBlue";
        textareaToSwitch.value = str;
    } 
</script>

<main>
    <div class="container text-center">
        <div class="row mt-10 d-flex" style="align-content:center; min-width:100vh; min-height:50vh;">
            <div class="col mx-3 my-2 full-size">
                <h2 class="align-center my-2">
                    {#if lang == constants.Lang.ENGLISH}
                        Simplified
                    {:else if lang == constants.Lang.CHINESE}
                        简体字
                    {/if}
                </h2>
                <hr class="my-2" style="border-top:1px solid black;">
                <div class="form-group full-size">
                    <label class="full-size" for="simp">
                        <textarea class="form-control" id="simp" rows="10" cols="25" on:input={(e) => handleInput(e)} {placeholder}></textarea>
                    </label>
                </div>
            </div>
            <div class="col mx-3 my-2 full-size">
                <h2 class="align-center my-2">
                    {#if lang == constants.Lang.ENGLISH}
                        Traditional
                    {:else if lang == constants.Lang.CHINESE}
                        繁體字
                    {/if}
                </h2>
                <hr class="my-2" style="border-top:1px solid black;">
                <div class="form-group full-size">
                    <label class="full-size" for="trad">
                        <textarea class="form-control" id="trad" rows="10" cols="25" on:input={(e) => handleInput(e)} {placeholder}></textarea>
                    </label>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    textarea {
        font-size:large;
    }

    .align-center {
        text-align:center;
    }

    .full-size {
        width: 100%;
        height: 100%;
        min-height: 100%;
    }
</style>