document.getElementById("botonNewPass").addEventListener("click", function () {
    const newPass = document.getElementById("nuevoPass").value;

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!newPass) {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Por favor, ingresa una nueva contraseña.',
        });
        return;
    }
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Token inválido o no proporcionado.',
        });
        return;
    }

    fetch("https://mighty-basin-21232-3982f0b02cea.herokuapp.com/users/changePassword", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            
        },
        body: JSON.stringify({ token, newPassword: newPass })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Contraseña modificada!',
                text: 'vuelve al login para ingresar tu nuevo pass',
                confirmButtonText: 'Continuar'
            }).then(() => {
                window.location.href = "login.html"; 
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al enviar la nueva contraseña.',
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