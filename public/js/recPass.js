document.getElementById("botonRec").addEventListener("click", function () {
    const email = document.getElementById("email").value;

    if (!email) {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Por favor, ingresa tu email para recuperar la contraseña.',
        });
        return;
    }

    fetch("https://mighty-basin-21232-3982f0b02cea.herokuapp.com/users/recPass", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Correo enviado!',
                text: 'Revisa tu email para cambiar la contraseña.',
                confirmButtonText: 'Continuar'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al enviar el correo.',
            });
        }
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    });
});


