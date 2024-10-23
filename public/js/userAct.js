 //actualizar usuarios
 
 
document.addEventListener('DOMContentLoaded', function () {

    const userId = localStorage.getItem('userId');
 
 if (userId) {
    fetch(`https://mighty-basin-21232-3982f0b02cea.herokuapp.com/api/user/${userId}`)  
        .then(response => response.json())
        .then(user => {
            document.getElementById('nombre').value = user.nombre;
            document.getElementById('apellido').value = user.apellido;
            document.getElementById('email').value = user.email;
        })
        .catch(error => console.error('Error al cargar los datos del usuario:', error));
} else {
    alert('Usuario no logueado');
}

// Set dynamic form action
if (userId) {
    document.getElementById('updateForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('email').value;
        const contraseña = document.getElementById('contraseña').value;

        fetch(`https://mighty-basin-21232-3982f0b02cea.herokuapp.com/api/userUpdate/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, apellido, email, contraseña })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Perfil actualizado correctamente');
            } else {
                alert('Error al actualizar el perfil');
            }
        })
        .catch(error => {
            console.error('Error al actualizar el perfil:', error);
        });
    });
}



// Hacer la solicitud para obtener los datos del usuario
fetch(`https://mighty-basin-21232-3982f0b02cea.herokuapp.com/api/getUser/${userId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
        }
        return response.json();
    })
    .then(data => {
        // Rellenar los campos del formulario con los datos del usuario
        document.getElementById('nombre').value = data.nombre || '';
        document.getElementById('apellido').value = data.apellido || '';
        document.getElementById('email').value = data.email || '';
    })
    .catch(error => {
        console.error('Error al cargar los datos del usuario:', error);
        alert('Error al cargar los datos del usuario');
    });

// Configurar el formulario de actualización de usuario
const updateForm = document.getElementById('updateForm');
if (updateForm) {
    updateForm.action = `https://mighty-basin-21232-3982f0b02cea.herokuapp.com/api/userUpdate/${userId}`;
}
})