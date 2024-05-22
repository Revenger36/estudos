$(document).ready(function () {
    var adicionar = `<div class="row">
    <div class="col">
        <div class="input-group mb-3">
            <input id="uniInput" type="text" class="form-control form-control-sm" placeholder="" aria-label=""
                aria-describedby="basic-addon2">
            <div class="input-group-append">
            </div>
        </div>

    </div>`
    $(".adicionar").on("click", function () {
        $(".newBody").append(adicionar);
    })

})