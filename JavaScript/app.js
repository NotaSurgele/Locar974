document.getElementById('inscription').addEventListener("submit", function(e) {
    var error;
    var inputs = document.getElementById("inscription").getElementsByTagName("input")

    for (var i = 0; i < inputs.length; i++) {
        if(!inputs[i].value) {
            error = "Veuillez renseigner tous les champs";
        }
    }

    if (error) {
        e.preventDefault();
        document.getElementById("error").innerHTML = error;
        return false;
    } else {
        alert('Formulaire envoyé !');
    }
})