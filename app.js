// Variables
const baseDeDatos = [
  {
    id: 1,
    nombre: 'Patata',
    precio: 3,
    imagen: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 2,
    nombre: 'Cebolla',
    precio: 2.2,
    imagen: 'https://images.unsplash.com/photo-1508747703725-719777637510?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
  },
  {
    id: 3,
    nombre: 'Calabacin',
    precio: 2.1,
    imagen: 'https://images.unsplash.com/photo-1596056094719-10ba4f7ea650?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80'
  },
  {
    id: 4,
    nombre: 'Fresas',
    precio: 4.5,
    imagen: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  }

];

let carrito = [];
const divisa = 's/';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');

// Funciones

/**
* Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
*/
function renderizarProductos() {
  baseDeDatos.forEach((info) => {
    // Estructura
    const miNodo = document.createElement('div');
    miNodo.classList.add('card', 'col-sm-6');
    // Body
    const miNodoCardBody = document.createElement('div');
    miNodoCardBody.classList.add('card-body', 'd-flex', 'flex-column', 'align-items-center');
    // Titulo
    const miNodoTitle = document.createElement('h5');
    miNodoTitle.classList.add('card-title');
    miNodoTitle.textContent = info.nombre;
    // Imagen
    const miNodoImagen = document.createElement('img');
    miNodoImagen.classList.add('img-fluid', 'img-products');
    miNodoImagen.setAttribute('src', info.imagen);
    // Precio
    const miNodoPrecio = document.createElement('p');
    miNodoPrecio.classList.add('card-text');
    miNodoPrecio.textContent = `${divisa} ${info.precio}`;
    // Boton 
    const miNodoBoton = document.createElement('button');
    miNodoBoton.classList.add('btn', 'btn-primary', 'fw-bold');
    miNodoBoton.textContent = '+';
    miNodoBoton.setAttribute('marcador', info.id);
    miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
    // Insertamos
    miNodoCardBody.appendChild(miNodoImagen);
    miNodoCardBody.appendChild(miNodoTitle);
    miNodoCardBody.appendChild(miNodoPrecio);
    miNodoCardBody.appendChild(miNodoBoton);
    miNodo.appendChild(miNodoCardBody);
    DOMitems.appendChild(miNodo);
  });
}

/**
* Evento para añadir un producto al carrito de la compra
*/
function anyadirProductoAlCarrito(evento) {
  // Anyadimos el Nodo a nuestro carrito
  carrito.push(evento.target.getAttribute('marcador'))
  // Actualizamos el carrito 
  renderizarCarrito();

}

/**
* Dibuja todos los productos guardados en el carrito
*/
function renderizarCarrito() {
  // Vaciamos todo el html
  DOMcarrito.textContent = '';
  // Quitamos los duplicados
  const carritoSinDuplicados = [...new Set(carrito)];
  // Generamos los Nodos a partir de carrito
  carritoSinDuplicados.forEach((item) => {
    // Obtenemos el item que necesitamos de la variable base de datos
    const miItem = baseDeDatos.filter((itemBaseDatos) => {
      // ¿Coincide las id? Solo puede existir un caso
      return itemBaseDatos.id === parseInt(item);
    });
    // Cuenta el número de veces que se repite el producto
    const numeroUnidadesItem = carrito.reduce((total, itemId) => {
      // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
      return itemId === item ? total += 1 : total;
    }, 0);
    // Creamos el nodo del item del carrito
    const miNodo = document.createElement('li');
    miNodo.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'justify-content-between', 'align-items-center');
    miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio} ${divisa}`;
    // Boton de borrar
    const miBoton = document.createElement('button');
    miBoton.classList.add('btn', 'btn-danger', 'fw-bold');
    miBoton.textContent = 'x';
    miBoton.style.marginLeft = '1rem';
    miBoton.dataset.item = item;
    miBoton.addEventListener('click', borrarItemCarrito);
    // Mezclamos nodos
    miNodo.appendChild(miBoton);
    DOMcarrito.appendChild(miNodo);
  });
  // Renderizamos el precio total en el HTML
  DOMtotal.textContent = calcularTotal();
}

/**
* Evento para borrar un elemento del carrito
*/
function borrarItemCarrito(evento) {
  // Obtenemos el producto ID que hay en el boton pulsado
  const id = evento.target.dataset.item;
  // Borramos todos los productos
  carrito = carrito.filter((carritoId) => {
    return carritoId !== id;
  });
  // volvemos a renderizar
  renderizarCarrito();
}

/**
* Calcula el precio total teniendo en cuenta los productos repetidos
*/
function calcularTotal() {
  // Recorremos el array del carrito 
  return carrito.reduce((total, item) => {
    // De cada elemento obtenemos su precio
    const miItem = baseDeDatos.filter((itemBaseDatos) => {
      return itemBaseDatos.id === parseInt(item);
    });
    // Los sumamos al total
    return total + miItem[0].precio;
  }, 0).toFixed(2);
}

/**
* Varia el carrito y vuelve a dibujarlo
*/
function vaciarCarrito() {
  // Limpiamos los productos guardados
  carrito = [];
  // Renderizamos los cambios
  renderizarCarrito();
}

// Eventos
DOMbotonVaciar.addEventListener('click', vaciarCarrito);

// Inicio
renderizarProductos();
renderizarCarrito();

