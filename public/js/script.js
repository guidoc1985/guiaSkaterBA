



document.addEventListener('DOMContentLoaded', function () {

    const baseUrl = window.location.origin.includes('localhost')
    ? 'http://localhost:3000'
    : 'https://mighty-basin-21232-3982f0b02cea.herokuapp.com';


    //manejo para el swall fire del login
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function(event){
            event.preventDefault();
            const email = document.getElementById("email").value;
            const contraseña = document.getElementById("password").value;

            fetch(`${baseUrl}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, contraseña })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error('Error al iniciar sesión: ' + errorData.error);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('nombre', data.nombre);
                    localStorage.setItem('userId', data.idusuarios);

                    Swal.fire({
                        icon: 'success',
                        title: '¡Inicio de sesión exitoso!',
                        text: 'Bienvenido, ' + data.nombre,
                        confirmButtonText: 'Continuar'
                    }).then(() => {
                        
                        window.location.href = "index.html";
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Credenciales incorrectas',
                        text: 'Por favor, verifica tus datos.',
                    });
                }
                }
            )
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al iniciar sesión',
                    text: "error de credenciales",
                });
            });
        });
    } 




    // logout 
const logoutButton = document.getElementById("logoutButton")

if(logoutButton){
    logoutButton.addEventListener("click", function(event){
        event.preventDefault();

        localStorage.removeItem('token');
        localStorage.removeItem('nombre');
        localStorage.removeItem('userId');

        window.location.href = "login.html"
    })}else{
        console.log("error de cierre de sesion")
    }

    //script para que muestre el swal fire cuando creo el usuario//
    let formulario = document.getElementById("userForm");

    formulario.addEventListener("submit", function (e) {
        let errores = [];

        // Validaciones del frontend
        let campoNombre = document.querySelector("input[name='nombre']");
        if (campoNombre.value === "") {
            errores.push("El nombre no puede estar vacío");
        } else if (campoNombre.value.length < 2) {
            errores.push("El nombre debe tener más de 2 letras");
        }

        let campoApellido = document.querySelector("input[name='apellido']");
        if (campoApellido.value === "") {
            errores.push("El apellido no puede estar vacío");
        } else if (campoApellido.value.length < 2) {
            errores.push("El apellido debe tener más de 2 letras");
        }

        let campoEmail = document.querySelector("input[name='email']");
        if (campoEmail.value === "") {
            errores.push("El campo de email es obligatorio");
        }

        let campoPass = document.querySelector("input[name='contraseña']");
        if (campoPass.value === "") {
            errores.push("El campo de contraseña es obligatorio");
        } else if (campoPass.value.length < 8) {
            errores.push("La contraseña debe tener al menos 8 caracteres");
        }else {
           
            const regexMayuscula = /[A-Z]/;
            const regexMinuscula = /[a-z]/;
            
            if (!regexMayuscula.test(campoPass.value)) {
                errores.push("La contraseña debe tener al menos una letra mayúscula");
            }
        
            if (!regexMinuscula.test(campoPass.value)) {
                errores.push("La contraseña debe tener al menos una letra minúscula");
            }
        }



        // Mostrar errores si hay
        if (errores.length > 0) {
            e.preventDefault(); // Detener el envío del formulario

            let ulErrores = document.querySelector("#errores ul");
            ulErrores.innerHTML = ""; // Limpiar errores previos

            for (let i = 0; i < errores.length; i++) {
                ulErrores.innerHTML += "<li>" + errores[i] + "</li>";
            }
        } else {
            // Si no hay errores, continuar con el envío y manejar el SweetAlert
            e.preventDefault();

            const nombre = document.getElementById("nombre").value;
            const apellido = document.getElementById("apellido").value;
            const email = document.getElementById("email").value;
            const contraseña = document.getElementById("contraseña").value;

            fetch(`${baseUrl}/users/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, apellido, email, contraseña })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario creado, Revisá tu bandeja de correo para finalizar el registro!',
                        text: data.message,
                        confirmButtonText: 'Continuar'
                    }).then(() => {
                        window.location.href = "registrate.html";
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: "Revisá el email que puede existir en la base de datos",
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar el usuario',
                    text: error.message,
                });
            });
        }
    });

   

   
});
