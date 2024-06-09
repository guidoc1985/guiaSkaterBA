// menu interactivo

const Producto = function(nombre,precio,stock){
    this.nombre= nombre,
    this.precio = precio
    this. stock = stock
}

let producto1= new Producto ("Remera", 10000, 20)
let producto2= new Producto ("Pantalon", 45500, 26)
let producto3= new Producto ("Buzo", 35000, 45)
let producto4= new Producto ("Camisa", 40000, 23)

//LISTA DE PRODUCTOS DISPONIBLES
let lista = [producto1,producto2,producto3,producto4]


//FUNCION QUE FILTRA LOS PRODUCTOS Y MUESTRA EL PRECIO Y EL STOCK
// function filtrarProductos(){
//     let palabraClave = prompt("ingresa el producto que deseas buscar: \nREMERA \nPANTALON \nBUZO \nCAMISA \nCARRITO").trim().toUpperCase()
//     let resultado = lista.filter((producto)=> producto.nombre.toUpperCase().includes(palabraClave))

//     if (resultado.length > 0 || palabraClave =="CARRITO" ){
//         console.table(resultado)
//         alert("Tenemos el producto que buscas!")
//     }else{
//         alert("no tenemos ese producto, intentá de nuevo")
//     }
//  // BUCLE QUE ME REPITE LA OPCION HASTA QUE ELIJO CARRITO Y SALE
// while(palabraClave!="CARRITO"){
//     filtrarProductos()
//     break
// }
// }      
// filtrarProductos()

//DECLARO UN ARRAY VACIO
let carrito =[];

// const producto = document.getElementById("producto1")
// const agregar = document.getElementById("boton")
//FUNCION QUE BUSCA UN NOMBRE CON UN PROMPT Y LUEGO CON LA VARIABLES AGREGAR PRODUCTO LO FILTRA SI ESTA EN LA LISTA

// let boton = document.getElementById("boton")

// boton.addEventListener("click", function agregarProducto(){

    
//     let nombre = prompt ("Te gusto el producto? ingresa el nombre del producto para agregarlo al carrito").trim().toUpperCase()
 
//     let agregarProducto = lista.filter((producto)=> producto.nombre.toUpperCase().includes(nombre))

//     // SI EL PRODUCTO ESTA EN LA LISTA LO PUSHEA A CARRITO
//     if(agregarProducto.length > 0){
//         alert("producto agregado con exito!")
//     carrito.push(nombre)
//     console.table(carrito)
//     }
  
// })


let contador = 0;

 function agregarProducto(producto, precio){
    carrito.push({ nombre : producto, precio: precio });
    console.table(carrito)

    if (carrito.length >0){
        contador++
        document.querySelector(".contador").textContent = contador;
    }
    // let nombre = prompt ("Te gusto el producto? ingresa el nombre del producto para agregarlo al carrito").trim().toUpperCase()
 
    // let agregarProducto = lista.filter((producto)=> producto.nombre.toUpperCase().includes(nombre))

    // // SI EL PRODUCTO ESTA EN LA LISTA LO PUSHEA A CARRITO
    // if(agregarProducto.length > 0){
    //     alert("producto agregado con exito!")
    // carrito.push(nombre)
    // console.table(carrito)
    // }
  
}


  
  
    
  




//   boton.addEventListener("click", agregarProducto)

// agregar.addEventListener("click", agregarProducto)

//FUNCION QUE OFRECE AGREGAR UN PRODUCTO MAS SI SE VIO
// function ofrecerMasProductos(){
//     let nombre = prompt ("Queres agregar mas productos?  " ).trim().toUpperCase()
//     let agregarProducto = lista.filter((producto)=> producto.nombre.toUpperCase().includes(nombre))
//     if (agregarProducto.length > 0){
//         alert("producto agregado con exito!")
//         carrito.push(nombre)
//         console.table(carrito)
//         }

//     if(agregarProducto.length>0){
//         alert("Gracias por tu compra!")
//     }
// }


agregarProducto()
// ofrecerMasProductos()
 



    