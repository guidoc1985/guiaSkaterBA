

document.addEventListener('DOMContentLoaded', function () {

//erorres de carga spot//

let formularioSpot = document.getElementById("spotForm");

formularioSpot.addEventListener("submit", function(e) {
    e.preventDefault(); 
    let errors = [];

    let nombreSpot = document.getElementById("nombre").value;
    if (nombreSpot === "") {
        errors.push("El nombre es obligatorio");
    }

    let descripcion = document.getElementById("descripcion").value;
    if (descripcion === "") {
        errors.push("La descripción es obligatoria");
    }

    let direccion = document.getElementById("direccion").value;
    if (direccion === "") {
        errors.push("La dirección es obligatoria");
    }



    let enlace = document.getElementById("enlace").value;
    if (enlace === "") {
        errors.push("El enlace es obligatorio");
    }

    let imagen = document.getElementById("imagen").files[0];
    if (!imagen) {
        errors.push("La imagen es obligatoria");
    }

    let mostrarErrors = document.getElementById("errores");
    mostrarErrors.innerHTML = ""; // Limpiar errores previos

    if (errors.length > 0) {
        for (let i = 0; i < errors.length; i++) {
            mostrarErrors.innerHTML += "<li>" + errors[i] + "</li>";
        }
    } 
    
    else {
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccion)}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("No se encontraron coordenadas para la dirección proporcionada.");
                return;
            }

    
            let lat = data[0].lat;
            let lng = data[0].lon;

           
            const formData = new FormData(formularioSpot);
            formData.append('lat', lat);
            formData.append('lng', lng);

            
            fetch('https://mighty-basin-21232-3982f0b02cea.herokuapp.com/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Spot registrado!',
                        text: "Se cargó correctamente",
                        confirmButtonText: 'Continuar',
                        allowOutsideClick: false,
                        allowEscapeKey: false    
                    }).then(() => {
                        window.location.href = "index.html";
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.error,
                        confirmButtonText: 'OK',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar el spot',
                    text: "Error en la comunicación con el servidor.",
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
            });
        })
        .catch(error => {
            console.error("Error en la geocodificación:", error);
            alert("Hubo un problema al obtener las coordenadas.");
        });
    }
});
});