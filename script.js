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

    // Array de lugares recomendados con coordenadas y descripciones
    var lugares = [
        {
            nombre: "Eh park skatepark",
            coords: [-34.71319167517402, -58.27251236595334],
            descripcion: "El templo del skate argentino",
            foto: "https://scontent.faep9-2.fna.fbcdn.net/v/t39.30808-6/326359224_853878279241313_3307608468837664815_n.jpg?stp=dst-jpg_s960x960&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=U8Ab9RAJcTEQ7kNvgFMyAp-&_nc_ht=scontent.faep9-2.fna&oh=00_AYAQMAqo7AakhcOi_w89CLvizSsPky7q_-2qC2j457Rj2Q&oe=666B0486",
            enlace: "https://www.ehpark.com/"
        },
        {
            nombre: "14 de Agosto DIY",
            coords: [-34.726609637953445, -58.25982948970078],
            descripcion: "Primer DIY de la ciudad de Quilmes",
            foto: "https://gozamedia.com.ar/wp-content/uploads/2020/05/DSCF4145-gozamedia-1024x684.jpg",
            enlace: "https://www.instagram.com/14deagostodiy/"
        },
        {
            nombre: "Ribera skatepark Quilmes",
            coords: [-34.70696745755898, -58.23068469489442],
            descripcion: "Pista en las orillas del rio de la plata",
            foto: "img/luchi.png",
            enlace: "https://www.instagram.com/riberaskateparkquilmes/?__d=11"
        },
        {
            nombre: "Los barriers",
            coords: [-34.70844816980061, -58.28333958865184],
            descripcion: "DIY en la estación de Bernal #Zanel4ever",
            foto: "https://gozamedia.com.ar/wp-content/uploads/2016/02/IMG_0504.jpg",
            enlace: "https://www.instagram.com/barrierbernaldiy/?hl=es"

        },
        {
            nombre: "Plaza suiza slappy y miniramp",
            coords: [-34.71265192471518, -58.27112964204852],
            descripcion: "plaza con flat amplio, miniramp y slappy",
            foto: "img/suiza.png",
           
        },
        {
            nombre: "Slappy DIY Bernal",
            coords: [-34.70898157093809, -58.28208392848586],
            descripcion: "pasillo con slappies, bordes y muchos obstáculos",
            foto: "https://gozamedia.com.ar/wp-content/uploads/2018/09/IMG_2736.jpg",
            enlace: "https://www.instagram.com/slappydiybernal/"
           
        },
        {
            nombre: "Quilmes Skatepark",
            coords: [ -34.74227091777476, -58.250675064241065],
            descripcion: "skatepark público con sector street y bowl",
            foto: "https://hechoenquilmes.com/wp-content/uploads/2021/04/mayra-inauguro-el-skatepark-municipal-del-parque-de-la-ciudad-3.jpeg?w=660&h=330&crop=1",
            enlace: "https://www.instagram.com/quilmeskatepark_club/?hl=es"
           
        }

    ];

    // Añadir marcadores para cada lugar
    lugares.forEach(function(lugar) {
        L.marker(lugar.coords, {icon: customIcon}).addTo(map)
            .bindPopup('<b>' + lugar.nombre + '</b><br>' + lugar.descripcion + '<br><img src="' + lugar.foto + '" alt="' + lugar.nombre + '" style="width:100%;max-width:200px;"><br><a href="' + lugar.enlace + '" target="_blank">Más información</a>' );
    });


// Capturar el evento de envío del formulario de búsqueda
document.getElementById('busqueda').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener el valor del campo de búsqueda
    var searchTerm = document.getElementById('busquedaInput').value.trim();

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









