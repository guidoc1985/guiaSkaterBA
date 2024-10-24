document.addEventListener('DOMContentLoaded', function () {
    const nombreUsuario = localStorage.getItem('nombre');
    if (nombreUsuario) {
        document.getElementById('nombreUsuario').textContent = `Tu perfil: Hola, ${nombreUsuario} !`;
    } else {
        console.log("No se encontró un nombre de usuario en localStorage");  
    }
});  