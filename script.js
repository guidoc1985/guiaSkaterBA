document.addEventListener('DOMContentLoaded', function () {
    
    var map = L.map('map').setView([-34.61, -58.38], 13);

    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var customIcon = L.icon({
        iconUrl: "img/skateboard.png" ,
        iconSize: [25, 41], 
        iconAnchor: [12, 41], 
        popupAnchor: [1, -34] 
    });



    

fetch("lugares.json")
.then(response => response.json())
.then((lugares)=> {



    lugares.forEach(function(lugar) {
        L.marker(lugar.coords, {icon: customIcon}).addTo(map)
            .bindPopup('<b>' + lugar.nombre + '</b><br>' + lugar.descripcion + '<br><img src="' + lugar.foto + '" alt="' + lugar.nombre + '" style="width:100%;max-width:200px;"><br><a href="' + lugar.enlace + '" target="_blank">Más información</a>' );
    });



document.getElementById('busqueda').addEventListener('submit', function(event) {
    event.preventDefault(); 

    
    var searchTerm = document.getElementById('busquedaInput').value.trim().toLowerCase();

if (searchTerm == ""){
    alert("Ingresa un valor para poder buscarlo!")
    
}

   
    var lugarEncontrado = lugares.find(function(lugar) {
        return lugar.nombre.toLowerCase().includes(searchTerm);
    });

    
    if (lugarEncontrado) {
        map.setView(lugarEncontrado.coords, 16);
    } 
     else {
        alert('Lugar no encontrado.');
    }
});
});
})








