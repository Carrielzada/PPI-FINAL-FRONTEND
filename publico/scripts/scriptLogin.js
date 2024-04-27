const form = document.getElementById('formLogin');

function validar(e) {
    if (form.checkValidity() === false) {
        form.classList.add('was-validated');
        e.preventDefault();
        e.stopPropagation();
    } else {
        form.classList.remove('was-validated');
    }
}

form.addEventListener('submit', validar);