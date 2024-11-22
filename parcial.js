'use strict';
/*
 * DEMARZIANI, ANA MARIA
 */

// Array de productos
const productos = [
    {
        id: 1, // El ID único e irrepetible del producto (Útil para su búsqueda)
        nombre: 'Super Confort',
        descripcion: 'Bolso de piel con solapa, cierra con broche imán central.  Forrado en algodón 100% con estampa exclusiva Sentèz. Dos bolsillos interno sin cremallera. Asa corta fija de mano y otra larga removible para uso bandolera o de hombro de 0,90 m con monedero colgante incluido extraíble y con posibilidad de uso en otros bolsos o prendas.',
        precio:405500,
        imagen: 'CarteraSuperConfortBeige.jpg',
        categoria: 'Pequeño',
        colores: [{
            descripcion: 'Beige',
            hex: "#967d63"
        }]
    },
    {
        id: 2,
        nombre: 'Rubí',
        descripcion: 'Bolso de piel texturada, cierra con cremallera. Dos asas fijas cortas para uso de mano y otra larga para uso de hombro o bandolera. Forrado en algodón 100% con estampa exclusiva Sentèz. Dos bolsillos internos plaqué.',
        precio: 432500,
        imagen: 'CarteraRubiNegro.jpg',
        categoria: 'Grande',
        colores: [{
            descripcion: 'Negro',
            hex: "#000000"
        }]
    },
    {
        id: 3,
        nombre: 'Minerva',
        descripcion: 'Bolso de piel. Cirra con broche imán incorporado a herraje exclusivo con logo de marca. Interior 100% algodón con estampa exclusiva Sentèz, un bolsillo interno plaqué. Asa media para uso de hombro desmontable.',
        precio: 322500,
        imagen: 'carteraMinervaNegro.jpg',
        categoria: 'Pequeño',
        colores: [{
            descripcion: 'Negro',
            hex: "#000000"
        }]
    },
    {
        id: 4,
        nombre: 'Lyon',
        descripcion: 'Bolso de piel de formato irregular con solapa. Cierra con dos broches imán. Forrado en algodón 100% con estampa exclusiva Sentèz. Un bolsillo interno con cremallera. Asa corta de mano fija y otra larga desmontable de 0,90 m para uso de hombro o bandolera, con media caña para colgar accesorios sentèz y poder customizarlo.',
        precio:443500,
        imagen: 'CarteraLyonRojo.jpg',
        categoria: 'Pequeño',
        colores: [{
            descripcion: 'Rojo',
            hex: "#DC0000"
        }]
    },
    {
        id: 5,
        nombre: 'Lazio',
        descripcion: 'Bolso de piel , cierra con cremallera. Forrado con algodón 100% con estampa exclusiva Sentèz.  Asa regulable con torniquete lateral giratorio y ojales para 5 opciones de uso, según la ocasión. Bolso ideal para uso formal y casual, de tamaño grande.',
        precio: 334500,
        imagen: 'CarteraLazioNaranja.jpg',
        categoria: 'Mediano',
        colores: [{
            descripcion: 'Naranja',
            hex: "#f15602"
        }]
    },
    {
        id: 6,
        nombre: 'Jade',
        descripcion: 'Bolso de piel mórbido con solapa,  cierra con broche imán incorporado a herraje exclusivo con la marca. Forrado en algodón 100% con estampa exclusiva Sentèz. Interior con división, un bolsillo interno plaqué y otro con cremallera. Asa fija regulable para uso de  mano u hombro. Herrajes Oro o niquel según la base de color.',
        precio: 497500,
        imagen: 'CarteraJadeNegro.jpg',
        categoria: 'Grande',
        colores: [{
            descripcion: 'Negro',
            hex: "#000000"
        }]
    },
];

// Objeto que administra el carrito
const carrito = {
    items: [],
    agregarAlCarrito(producto)
    {
        let productoEnCarrito = this.items.find( x=> x.id == producto.id );
        if( productoEnCarrito ){
            productoEnCarrito.cantidad += 1 ;
        }
        else
        {
            carrito.items.push({...producto, cantidad : 1});
        }
        this.calcularCantidad();
        this.calcularTotal();
    },
    calcularTotal(){
        let suma = this.items.reduce( (acc,valorActual)=> acc  + valorActual.precio * valorActual.cantidad,0 );
        
        return suma;
    },
    calcularCantidad()
    {
        let cantidadDeProductos = this.items.reduce( (acc,valorActual)=> acc  + valorActual.cantidad ,0 );
        const $carritoCantidad = document.querySelector("#mini-carrito-cantidad")
        $carritoCantidad.innerText = cantidadDeProductos;
        return cantidadDeProductos;
    },
    limpiarCarrito()
    {
        this.items = [];
        this.calcularCantidad();
        this.calcularTotal();
    },
    removeProductoDelCarrito(id)
    {    
        this.items = this.items.filter( x=> x.id != id);
        this.calcularCantidad();
        this.calcularTotal();
    }
}

/**
 * @description Funcion inicial.
 */
function iniciar()
{
    mostrarProductos();
}

function mostrarProductos(){
    let $seccionProductos = document.querySelector("#productos");
    let $productosDom =  productos.map(p => crearElementoCajaProducto(p) );
    $seccionProductos.append(...$productosDom);
}
function mostrarCarrito() {
    const $body = document.querySelector("body");
    const $modal = crearElemento("dialog",{'class':"modal-carrito"});
    $modal.addEventListener('click', (event) => {
        if (event.target === $modal) {
            document.body.classList.remove("modalAbierto");
            $modal.close();
            $modal.remove()
        }
    });
    const $modalHeader = crearElemento("section",{"class":'modal-header'},"")
    const $modalContent = crearElemento("section",{"class":'modal-content'},"")
    const $modalFooter = crearElemento("section",{"class":'modal-footer '},"")

    // Header
    const $carrito = crearElemento("div",{'class':"carrito"});    
    const $carritoTitulo  = crearElemento("h2",{},"Productos agregados");
    const $botonVaciar = crearElemento('button',{'class':'limpiarProductos btn-secundario'},'Limpiar carrito');
    $botonVaciar.onclick = () =>{
        if(confirm("Esta seguro de limpiar el carrito?")){
            carrito.limpiarCarrito();
            let $productosUl = document.querySelector('.modal-carrito ul');
            while ($productosUl.firstChild) {
                $productosUl.removeChild($productosUl.firstChild);
            }
            refrescarTotalesProductoCarrito();
            $modal.close();
            $modal.remove();
            $body.classList.remove("modalAbierto");
        }
    }
    const $botonCerrar = crearElemento( "span", {"class":"icon-cerrar","alt":"Cerrar","title":"Cerrar"});
    $botonCerrar.onclick = () => {
            $modal.close();
            $modal.remove();
            $body.classList.remove("modalAbierto");
    };
    $modalHeader.append($botonVaciar, $botonCerrar, $carritoTitulo);

    const cantidadElementosCarrito = carrito.calcularCantidad();
    
    // Contenido
    if(cantidadElementosCarrito > 0)
    {
        const $spanProductos = crearElemento("span", {"class":"totalProductos"},`${cantidadElementosCarrito}`)
        const $spanTotal = crearElemento("p",{},`Items agregados`);
        const $itemsAgregados = crearElemento("div",{"class":`itemsAgregados`});
        $itemsAgregados.append($spanProductos,$spanTotal)
        

        const $listaProductos = crearElemento('ul');    
        carrito.items.forEach(producto=>{
            const $item = crearElemento("li");
            const $izquierda = crearElemento("div",{'class':'col-2'});
            const $derecha = crearElemento("div",{'class':'col-8'});
            const $imagenDelProducto = crearElemento('img',{'src': `./Assets/${producto.imagen}`})
            const $tituloProducto = crearElemento("h3",{},`${producto.nombre}`);
            const $precioProducto = crearElemento("p",{'class':'precio' }, formatearPrecio(producto.precio,0));
            const $cantidadProducto = crearElemento("span",{},`Cantidad: ${producto.cantidad}`);
            const $colores =  crearElemento('div',{'class':'color'});
    
            $colores.append(...producto.colores?.map(color =>  crearElementoColor( color, true,false,true ) ) );
            $izquierda.append($imagenDelProducto);
            $derecha.append($tituloProducto,$precioProducto,$cantidadProducto, $colores );
    
            const $enlaceEliminar = crearElemento('button',{'class':'btn-secundario'},"Eliminar")
            $enlaceEliminar.onclick = ()=> {    
                carrito.removeProductoDelCarrito(producto.id); 
                $item.remove();
                refrescarTotalesProductoCarrito();
            }
            $item.append($izquierda,$derecha,$enlaceEliminar);
            $listaProductos.append($item);
        })

        $modalContent.append($itemsAgregados, $listaProductos);
    }
    else
    {
        const $sinProductos = crearElemento("span",{},`No tiene productos en el carrito. Comience agregando un nuevo producto.`);
        $modalContent.append($sinProductos);1
    }

    //Footer
    const $totalcontainer = crearElemento("div",{"class":"total-container"});
    const $total = crearElemento("p",{},"Total:" )
    const $monto = crearElemento("strong",{"class":"total-container precio"}, formatearPrecio(carrito.calcularTotal()));
    $totalcontainer.append($total,$monto);
    $modalFooter.append($totalcontainer)    
    
    $carrito.append($modalHeader,$modalContent,$modalFooter);
    $modal.appendChild($carrito);
    $body.prepend($modal);
    
    refrescarTotalesProductoCarrito();

    $body.classList.add("modalAbierto");
    $modal.show();
}

function verDetalleProducto(producto)
{
    
    const $modal = crearElemento('dialog', {'id': 'modalProductos', 'class': 'modal'} )
    const $contenido = crearElemento('div', { 'class': 'modal-contenido' });
    const $contenidoizquierdo = crearElemento('div', { 'class': 'modalContenidoIzq' });
    const $contenidoderecho = crearElemento('div', { 'class': 'modalContenidoDer' });
    const $tituloModal = crearElemento('h2', {},  `${producto.nombre}` );
    const $img = crearElemento('img', { 'src': `./Assets/${producto.imagen}` });
    const $descripcionModal = crearElemento('p', { }, `${producto.descripcion}`);
    const $precioModal = crearElemento("p",{'class':'precio' }, formatearPrecio(producto.precio,0));
    const $categoriaModal = crearElemento('p', { 'class': 'categoria' }, `${producto.categoria}`);
    
    const $colores =  crearElemento('div',{'class':'color'});
    $colores.append(...producto.colores?.map(color => crearElementoColor(color,false,true,true) ));
    
    
    const $modalfooter = crearElemento('div', { 'class': 'modal-footer' });
    const $cerraModal = crearElemento( "span", {"class":"icon-cerrar","alt":"Cerrar","title":"Cerrar"});
    $cerraModal.onclick = (event) => {
            document.body.classList.remove("modalAbierto");
            $modal.close();
            $modal.remove();
    };
    
    const $agregarAlCarrito = crearElemento('button', {class:'btn-primario' }, 'Agregar al carrito' );
    $agregarAlCarrito.onclick = () => {
        carrito.agregarAlCarrito(producto); 
        $modal.close();
        $modal.remove();
        document.body.classList.remove("modalAbierto");
    };

    $modalfooter.append($agregarAlCarrito );
    $contenidoizquierdo.append($img);
    $contenidoderecho.append($cerraModal,$categoriaModal,$tituloModal, $precioModal,$colores,$descripcionModal,$modalfooter);
    $contenido.append($contenidoizquierdo, $contenidoderecho);
    $modal.append($contenido);
    
    $modal.addEventListener('blur', (event)=>{ 
        document.body.classList.remove("modalAbierto");
        $modal.close()
        $modal.remove();
    });
    $modal.addEventListener('click', (event) => {
        if (event.target === $modal) {
            document.body.classList.remove("modalAbierto");
            $modal.close();
            $modal.remove()
        }
    });
    document.body.prepend($modal);
    document.body.classList.add("modalAbierto");
    $modal.show();
}



/**
 * @description: Refresca la cabecera del modal de carrito, junto con los totales.
 */
function refrescarTotalesProductoCarrito() 
{
    const $modalHeader = document.querySelector(".modal-carrito .modal-header");
    const $modalContent = document.querySelector(".modal-carrito .modal-content");
    const $modalFooter = document.querySelector(".modal-carrito .modal-footer");
    const cantidadElementosCarrito = carrito.calcularCantidad();
    if(cantidadElementosCarrito == 0)
    {
        const $botonVaciar =  document.querySelector(".limpiarProductos");
        $botonVaciar.remove();
        
        const $sinProductos = crearElemento("span",{},`No tiene productos en el carrito.`);
        $modalContent.replaceChildren($sinProductos)
        $modalContent.append($sinProductos);    

        while ($modalFooter.firstChild) {
            $modalFooter.removeChild($modalFooter.firstChild);
        }
    }
    else
    {
        $modalContent.querySelector(".totalProductos").innerText = carrito.calcularCantidad();
        $modalFooter.querySelector(".total-container.precio").innerText = formatearPrecio( carrito.calcularTotal() );
    }
    
}

/**
 * Crea un nuevo elemento HTML y lo devuelve
 * @param {string} nombre el nombre del elemento a utilizar en el document.createElement
 * @param {Object} atributos objeto con los atributos del elemento a crear
 * @param {string} contenido Texto a agregar en la propiedad textContent del elemento
 * @return HTMLElement
 */
function crearElemento (nombre, atributos = {}, contenido = '') {
    const elemento = document.createElement(nombre);

    for (const atributo in atributos) {
        elemento.setAttribute(atributo, atributos[atributo]);
    }
  
    if (contenido) {
      elemento.textContent = contenido;
    }
  
    return elemento;
}

/**
 * Devuelve un numero en formato texto con la locacion es-AR
 * @param {*} precio 
 * @param {*} digitos 
 * @returns 
 */
function formatearPrecio(precio,digitos=2){
    return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: digitos
    }).format(precio);
}

/**
 * Returna un nuevo elemento de productos
 * @param {*} producto 
 * @param {string} contenedor Establece el contenedor del componente
 * @returns 
 * 
 */

function crearElementoCajaProducto(producto, contenedor='li',configuracionColores)
{
    /**
     * <li>
        * <article>
            <p class="categoria">Pequeño</p><img
                alt="Bolso ..."
                src="./Assets/CarteraSuperConfortBeige.jpg">
            <h3>Super Confort</h3>
            <p class="precio">$405.500</p>
            <div class="color">
                <div>
                    <span class="cajita" title="Beige" style="background-color: #967d63"></span>
                    <span>Beige</span>
                </div>
            </div>
            <p class="descripcion">Bolso de piel con solapa.....</p>
            <button class="btn-primario">Ver producto</button>
        </article>
     * </li>
     */

    const $tarjeta =  crearElemento(contenedor);
    const $img =  crearElemento('img',{"alt": `${producto.descripcion}`, "title":`${producto.nombre}`,"src" : `./Assets/${producto.imagen}`})
    const $detallesDelProducto = crearElemento("article");
    const $tituloDelProducto =  crearElemento("h3",{},`${producto.nombre}`);
    const $descripción =  crearElemento("p",{"class":"descripcion"},`${producto.descripcion}`)
    const $precio = crearElemento("p",{"class":"precio"}, formatearPrecio(producto.precio,0));
    const $categoria =  crearElemento("p",{'class':'categoria'},`${producto.categoria}`);
    const $colores =  crearElemento('div',{'class':'color'});
    $colores.append(...producto.colores?.map(color =>crearElementoColor(color, false,true,true)))
    

    let $verDetalleProductobtn = crearElemento("button")
    $verDetalleProductobtn.classList.add("btn-primario")
    $verDetalleProductobtn.innerText = "Ver producto"
    $verDetalleProductobtn.onclick = () => {
        verDetalleProducto(producto);
    }
    
    $detallesDelProducto.append($categoria,$img, $tituloDelProducto, $precio,$colores,$descripción,$verDetalleProductobtn);
    $tarjeta.append($detallesDelProducto);
    return  $tarjeta;
}

/**
 *  Retorna un elemento para los colores.
 * @param {*} color Objeto del color del producto
 * @param {*} mostrarLabel 
 * @param {*} mostrarcolor 
 * @param {*} mostrardescripcion 
 * @returns 
 */
function crearElementoColor(color, mostrarLabel=true, mostrarcolor=true, mostrardescripcion=true)
{    
    const $color = crearElemento('div',{},'')   ;
    const $label = crearElemento('span',{'class':'color-label'},`Color: `);
    const $cajaColor = crearElemento('span',{'class':'cajita','title':`${color.descripcion}`, "style":`background-color: ${color.hex}`}, ``);
    const $descripcionColor = crearElemento('span',{},`${color.descripcion}`);
    if(mostrarLabel)
        $color.append($label);
    if(mostrarcolor)
        $color.append($cajaColor);
    if(mostrardescripcion)
        $color.append($descripcionColor);

    return $color;   
}

iniciar();