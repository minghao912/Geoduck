<script lang="ts">
    export let simpContent = "", tradContent = "";
</script>

<main>
    <div class="container text-center">
        <div class="row mt-10 d-flex" style="align-content:center; min-width:100vh; min-height:50vh;">
            <div class="col mx-3 my-2 full-size">
                <h2 class="align-center my-2">
                    Simplified
                </h2>
                <hr class="my-2" style="border-top:1px solid black;">
                <div class="form-group full-size">
                    <label class="full-size" for="simp">
                    <textarea class="form-control" id="simp" rows="10" cols="25">{simpContent}</textarea>
                    </label>
                </div>
            </div>
            <div class="col mx-3 my-2 full-size">
                <h2 class="align-center my-2">
                    Traditional
                </h2>
                <hr class="my-2" style="border-top:1px solid black;">
                <div class="form-group full-size">
                    <label class="full-size" for="trad">
                        <textarea class="form-control" id="trad" rows="10" cols="25">{tradContent}</textarea>
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