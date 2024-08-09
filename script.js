document.addEventListener('DOMContentLoaded', function () {
    // Crear el mapa y establecer la vista inicial en Buenos Aires
    var map = L.map('map').setView([-34.61, -58.38], 13);

    // Añadir una capa de mapa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var customIcon = L.icon({
        iconUrl: "img/skateboard.png" ,
        iconSize: [25, 41], // Tamaño del icono
        iconAnchor: [12, 41], // Punto de anclaje del icono
        popupAnchor: [1, -34] // Punto de anclaje del popup
    });



    

fetch("lugares.json")
.then(response => response.json())
.then((lugares)=> {



    lugares.forEach(function(lugar) {
        L.marker(lugar.coords, {icon: customIcon}).addTo(map)
            .bindPopup('<b>' + lugar.nombre + '</b><br>' + lugar.descripcion + '<br><img src="' + lugar.foto + '" alt="' + lugar.nombre + '" style="width:100%;max-width:200px;"><br><a href="' + lugar.enlace + '" target="_blank">Más información</a>' );
    });


// Capturar el evento de envío del formulario de búsqueda
document.getElementById('busqueda').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener el valor del campo de búsqueda
    var searchTerm = document.getElementById('busquedaInput').value.trim().toLowerCase();

if (searchTerm == ""){
    alert("Ingresa un valor para poder buscarlo!")
    
}

    // Buscar el lugar en el array de lugares
    var lugarEncontrado = lugares.find(function(lugar) {
        return lugar.nombre.toLowerCase().includes(searchTerm);
    });

    // Centrar el mapa en el lugar encontrado, si existe
    if (lugarEncontrado) {
        map.setView(lugarEncontrado.coords, 16);
    } 
     else {
        alert('Lugar no encontrado.');
    }
});
});
})








