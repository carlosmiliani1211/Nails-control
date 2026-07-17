let servicios = JSON.parse(localStorage.getItem("servicios")) || [];
let idEditando = null;
let idEliminar = null;

const preciosServicios = {

    "Manicure Permanente": 18000,
    "Pedicure Permanente": 30000,
    "Manicure Ruso": 26000,
    "Baño de Gel": 33000,
    "Soft Gel": 35000,
    "Poly Gel": 38000,
    "Manicure": 11000,
    "Pedicure": 18000,
    "Retiro sencillo": 5000,
    "Retiro Gel o Acrilico": 10000,
    "Reparacion de uña": 3000

};


// Mostrar / ocultar formulario
function mostrarFormulario(){

    const formulario =
        document.getElementById("formulario");

    if(formulario.classList.contains("oculto")){
        formulario.classList.remove("oculto");
    }else{
        formulario.classList.add("oculto");
    }

}


// Calcula comisión 40% desde servicios de lista
function actualizarMonto(){

    const servicio =
        document.getElementById("servicio").value;

    let precio = 0;


    if(preciosServicios[servicio]){
        precio = preciosServicios[servicio];
    }


    const adicionales =
        document.querySelectorAll(".adicional:checked");


    adicionales.forEach(item => {

        precio += Number(item.dataset.precio);

    });


    const descuento =
        document.getElementById("descuento10").checked;


    if(descuento){

        precio = precio * 0.90;

    }


    const comision =
        Math.round(precio * 0.40);


    document.getElementById("monto").value =
        comision;

}



// Editar servicio
function editarServicio(id){

    const servicioEditar =
        servicios.find(item => item.id === id);


    if(!servicioEditar){
        return;
    }


    document.getElementById("servicio").value =
        servicioEditar.servicio;


    document.getElementById("monto").value =
        servicioEditar.monto;


    idEditando = id;

}



// Guardar servicio
function guardarServicio(){


    const servicio =
        document.getElementById("servicio").value;


    const modoManual =
        document.getElementById("modoManual").checked;


    const descuento10 =
        document.getElementById("descuento10").checked;



    let precioCliente = 0;



    // Precio ingresado manualmente
    if(modoManual){

        precioCliente =
            Number(
                document.getElementById("precioManual").value
            );

    }

    // Precio seleccionado desde lista
    else{

        precioCliente = 0;


        if(preciosServicios[servicio]){

            precioCliente =
                preciosServicios[servicio];

        }


        document
        .querySelectorAll(".adicional:checked")
        .forEach(item => {

            precioCliente +=
            Number(item.dataset.precio);

        });

    }



    // Aplicar descuento tienda
    if(descuento10){

        precioCliente =
            precioCliente * 0.90;

    }



    // Ganancia siempre 40%
    const monto =
        Math.round(precioCliente * 0.40);



    // Editar registro existente
    if(idEditando){


        const registro =
            servicios.find(item => item.id === idEditando);



        registro.servicio = servicio;
        registro.monto = monto;


        localStorage.setItem(
            "servicios",
            JSON.stringify(servicios)
        );


        idEditando = null;


    }



    // Nuevo registro
    else{


        const hoy =
            new Date().toLocaleDateString("es-CL");


        const clientesHoy =
            servicios.filter(item => {


                const fechaRegistro =
                    new Date(item.fecha)
                    .toLocaleDateString("es-CL");


                return fechaRegistro === hoy;


            });



        const numeroCliente =
            clientesHoy.length + 1;



        const nuevoServicio = {

            id: Date.now(),

            numeroCliente,

            servicio,

            descuento10,

            precioEspecial: modoManual,

            precioCliente,

            monto,

            fecha: new Date()

        };



        servicios.push(nuevoServicio);


        localStorage.setItem(
            "servicios",
            JSON.stringify(servicios)
        );


    }



    // Limpiar formulario

    document.getElementById("servicio").value = "";

    document.getElementById("monto").value = "";

    document.getElementById("precioManual").value = "";

    document.getElementById("descuento10").checked = false;

    document.getElementById("modoManual").checked = false;



    cambiarModoManual();



    document
    .querySelectorAll(".adicional")
    .forEach(item => {

        item.checked = false;

    });



    actualizarPantalla();

}
// ===============================
// ELIMINAR SERVICIOS
// ===============================

function abrirModalEliminar(id){

    idEliminar = id;


    document
    .getElementById("modalEliminar")
    .classList.remove("oculto");

}



function cerrarModal(){

    document
    .getElementById("modalEliminar")
    .classList.add("oculto");

}



function confirmarEliminar(){


    servicios =
    servicios.filter(
        item => item.id !== idEliminar
    );


    localStorage.setItem(
        "servicios",
        JSON.stringify(servicios)
    );


    idEliminar = null;


    actualizarPantalla();


    cerrarModal();

}



// ===============================
// MENU OPCIONES
// ===============================

function mostrarOpciones(){

    const opciones =
        document.getElementById("opciones");


    opciones.classList.toggle("oculto");

}



// ===============================
// EXPORTAR RESPALDO
// ===============================

function exportarDatos(){


    document
    .getElementById("nombreArchivo")
    .value = "NailControl_Respaldo";


    document
    .getElementById("modalExportar")
    .classList.remove("oculto");

}



function cerrarModalExportar(){

    document
    .getElementById("modalExportar")
    .classList.add("oculto");

}



function confirmarExportar(){


    let nombreArchivo =
    document
    .getElementById("nombreArchivo")
    .value
    .trim();



    if(nombreArchivo === ""){

        nombreArchivo =
        "NailControl_Respaldo";

    }



    nombreArchivo =
    nombreArchivo.replace(
        /[\/\\:*?"<>|]/g,
        ""
    );



    const datos =
    JSON.stringify(
        servicios,
        null,
        2
    );



    const blob =
    new Blob(
        [datos],
        {
            type:"application/json"
        }
    );



    const url =
    URL.createObjectURL(blob);



    const enlace =
    document.createElement("a");



    enlace.href = url;


    enlace.download =
    nombreArchivo + ".json";



    document.body.appendChild(enlace);


    enlace.click();


    document.body.removeChild(enlace);


    URL.revokeObjectURL(url);



    cerrarModalExportar();

}



// ===============================
// IMPORTAR RESPALDO
// ===============================

function importarDatos(event){


    const archivo =
    event.target.files[0];



    if(!archivo){

        return;

    }



    const lector =
    new FileReader();



    lector.onload = function(e){


        try{


            const datos =
            JSON.parse(
                e.target.result
            );



            servicios = datos;



            localStorage.setItem(
                "servicios",
                JSON.stringify(servicios)
            );



            actualizarPantalla();



            alert(
                "Respaldo restaurado correctamente."
            );



        }
        catch(error){


            alert(
                "El archivo no es válido."
            );


            console.error(error);


        }


    };



    lector.readAsText(archivo);


}
// ===============================
// LIMPIAR FILTRO
// ===============================

function limpiarFiltro(){

    document
    .getElementById("filtroFecha")
    .value = "";


    actualizarPantalla();

}



// ===============================
// ACTUALIZAR PANTALLA
// ===============================

function actualizarPantalla(){


    const lista =
    document.getElementById("listaServicios");


    lista.innerHTML = "";



    let total = 0;



    const fechaFiltro =
    document
    .getElementById("filtroFecha")
    .value;



    servicios.forEach(item => {



        if(fechaFiltro){


            const fechaServicio =
            new Date(item.fecha);



            const fechaFormateada =
            `${fechaServicio.getFullYear()}-${String(fechaServicio.getMonth()+1).padStart(2,"0")}-${String(fechaServicio.getDate()).padStart(2,"0")}`;



            if(fechaFormateada !== fechaFiltro){

                return;

            }

        }



        total += item.monto;



        const fecha =
        new Date(item.fecha);



        const li =
        document.createElement("li");



        li.innerHTML = `

<strong>📅 Fecha:</strong> ${fecha.toLocaleDateString('es-CL')}<br>

<strong>🕒 Hora:</strong> ${fecha.toLocaleTimeString('es-CL')}<br>

<strong>👤 Cliente #${item.numeroCliente}</strong><br>

<strong>💅 Servicio:</strong> ${item.servicio}<br>

<strong>💰 Ganancia:</strong> $${item.monto.toLocaleString('es-CL')}<br>

${item.descuento10 ? "🎁 Descuento 10% aplicado<br>" : ""}

<br>

<button onclick="editarServicio(${item.id})">
✏️ Editar
</button>


<button onclick="abrirModalEliminar(${item.id})">
🗑️ Eliminar
</button>

`;



        lista.appendChild(li);



    });



    // INGRESO SEGÚN FILTRO

    document
    .getElementById("hoy")
    .textContent =
    `$${total.toLocaleString('es-CL')}`;





    // SEMANA ACTUAL

    const fechaActual =
    new Date();



    const inicioSemana =
    new Date(fechaActual);



    inicioSemana.setDate(
        fechaActual.getDate()
        -
        fechaActual.getDay()
        +
        1
    );



    inicioSemana.setHours(
        0,0,0,0
    );



    const finSemana =
    new Date(inicioSemana);



    finSemana.setDate(
        inicioSemana.getDate()+6
    );



    finSemana.setHours(
        23,59,59,999
    );



    let totalSemana = 0;



    servicios.forEach(item =>{


        const fecha =
        new Date(item.fecha);



        if(
            fecha >= inicioSemana &&
            fecha <= finSemana
        ){

            totalSemana += item.monto;

        }


    });



    document
    .getElementById("semana")
    .textContent =
    `$${totalSemana.toLocaleString('es-CL')}`;





    // MES ACTUAL


    let totalMes = 0;


    servicios.forEach(item =>{


        const fecha =
        new Date(item.fecha);



        if(
            fecha.getMonth()
            === fechaActual.getMonth()
            &&
            fecha.getFullYear()
            === fechaActual.getFullYear()
        ){

            totalMes += item.monto;

        }


    });



    document
    .getElementById("mes")
    .textContent =
    `$${totalMes.toLocaleString('es-CL')}`;



}




// ===============================
// MODO PRECIO MANUAL
// ===============================

function cambiarModoManual(){


    const manual =
    document
    .getElementById("modoManual")
    .checked;



    const contenedor =
    document
    .getElementById("contenedorManual");



    if(manual){


        contenedor
        .classList
        .remove("oculto");



        document
        .getElementById("servicio")
        .disabled = true;



        document
        .querySelectorAll(".adicional")
        .forEach(item => {

            item.disabled = true;

        });



        // Si usa precio manual,
        // no aplica descuento 10%

        document
        .getElementById("descuento10")
        .disabled = true;



        document
        .getElementById("monto")
        .value = "";


    }

    else{


        contenedor
        .classList
        .add("oculto");



        document
        .getElementById("servicio")
        .disabled = false;



        document
        .querySelectorAll(".adicional")
        .forEach(item => {

            item.disabled = false;

        });



        document
        .getElementById("descuento10")
        .disabled = false;



        document
        .getElementById("precioManual")
        .value = "";



        actualizarMonto();

    }


}




// ===============================
// CALCULAR PRECIO MANUAL
// ===============================

function calcularManual(){


    const precio =
    Number(
        document
        .getElementById("precioManual")
        .value
    );



    const comision =
    Math.round(
        precio * 0.40
    );



    document
    .getElementById("monto")
    .value =
    comision;


}





// CARGA INICIAL

window.onload = function(){

    actualizarPantalla();

};
