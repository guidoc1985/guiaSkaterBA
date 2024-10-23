document.addEventListener('DOMContentLoaded', function () {
    let spotNombre = ''; 

    // Evento para buscar el spot
    document.getElementById("busquedaSpot").addEventListener("submit", function (event) {
        event.preventDefault();

        const busquedaInput = document.getElementById('buscarSpots').value.trim();

        if (busquedaInput === "") {
            alert("Ingresa el nombre del spot");
            return;
        }

        spotNombre = encodeURIComponent(busquedaInput.trim());

        fetch(`https://mighty-basin-21232-3982f0b02cea.herokuapp.com/api/getSpot/${spotNombre}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok: " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('nombre').value = data.nonmbre_spot;
                document.getElementById('descripcion').value = data.descripcion;
                document.getElementById("direccion").value = data.direccion;
                document.getElementById('enlace').value = data.enlace;

                const coordenada = data.coordenada.match(/POINT\((.*?) (.*?)\)/);
                const lat = coordenada[1];
                const lon = coordenada[2];

                // Usar la API de Nominatim para obtener la dirección
                return fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
            })
            .then(response => response.json())
            .then(locationData => {
                document.getElementById('direccion').value = locationData.display_name; // Mostrar la dirección
            })
            .catch(error => {
                console.error('Error al obtener el spot o al convertir coordenadas en dirección:', error);
                alert('Error al obtener el spot o al convertir las coordenadas en una dirección.');
            });
    });

    // Evento para actualizar el spot
    document.getElementById('spotForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const direccion = document.getElementById('direccion').value;
        const enlace = document.getElementById('enlace').value;
        const imagen = document.getElementById('imagen').files[0]; 

        // API de Nominatim para convertir la dirección en coordenadas
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccion)}&format=json&limit=1`)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    alert('No se encontraron coordenadas para la dirección proporcionada.');
                    return;
                }

                const lat = data[0].lat;
                const lon = data[0].lon;

                const formData = new FormData();
                formData.append('nonmbre_spot', nombre);
                formData.append('descripcion', descripcion);
                formData.append('direccion', direccion);
                formData.append('lat', lat);  // Agregar latitud al formulario
                formData.append('lng', lon);  // Agregar longitud al formulario
                formData.append('enlace', enlace);
                if (imagen) {
                    formData.append('imagen', imagen);
                }

                // Enviar el formulario al backend
                fetch(`https://mighty-basin-21232-3982f0b02cea.herokuapp.com/api/spotUpdate/${spotNombre}`, {
                    method: 'PUT',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        alert('Spot actualizado correctamente');
                    } else {
                        alert('Error al actualizar el spot');
                    }
                })
                .catch(error => {
                    console.error('Error al actualizar el spot:', error);
                    alert('Error al actualizar el spot.');
                });

            })
            .catch(error => {
                console.error('Error al obtener coordenadas de Nominatim:', error);
                alert('Error al obtener las coordenadas.');
            });
    });
});

