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
    "Reparacion de uña": 3000,

};
function mostrarFormulario(){

    const formulario =
        document.getElementById("formulario");

    if(formulario.classList.contains("oculto")){
        formulario.classList.remove("oculto");
    }else{
        formulario.classList.add("oculto");
    }
}
function actualizarMonto(){

    const servicio =
        document.getElementById("servicio").value;

    let totalLocal = 0;

    if(preciosServicios[servicio]){
        totalLocal = preciosServicios[servicio];
    }

    const adicionales =
        document.querySelectorAll(".adicional:checked");

    adicionales.forEach(item => {

        totalLocal += Number(item.dataset.precio);

    });
const descuento =
    document.getElementById("descuento10").checked;

if(descuento){
    totalLocal = totalLocal * 0.90;
}
    const comision =
        Math.round(totalLocal * 0.40);

    document.getElementById("monto").value =
        comision;
}
function editarServicio(id){

    const servicioEditar =
        servicios.find(item => item.id === id);

    if(!servicioEditar){
        return;
    }

    document.getElementById("servicio").value =
        servicioEditar.servicio;

    actualizarMonto();

    document.getElementById("monto").value =
        servicioEditar.monto;

    idEditando = id;
}
function guardarServicio(){

    const servicio =
        document.getElementById("servicio").value;

   let precioBase;

const modoManual = document.getElementById("modoManual").checked;
const descuento10 = document.getElementById("descuento10").checked;

// Obtener precio base
if (modoManual) {
    precioBase = Number(document.getElementById("precioManual").value);
} 
else {
    precioBase = Number(document.getElementById("monto").value);
}

// Aplicar descuento tienda
if (descuento10) {
    precioBase = precioBase * 0.9;
}

// Calcular ganancia 40%
const monto = precioBase * 0.4;
   

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

 // Limpiar formulario
document.getElementById("servicio").value = "";
document.getElementById("monto").value = "";

document.getElementById("descuento10").checked = false;

document.getElementById("modoManual").checked = false;
document.getElementById("precioManual").value = "";

cambiarModoManual();

    document.querySelectorAll(".adicional").forEach(item => {
        item.checked = false;
    });

    mostrarFormulario();
    actualizarPantalla();

    return;
}
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
    descuento10: document.getElementById("descuento10").checked,
   precioEspecial: document.getElementById("modoManual").checked,
    monto,
    fecha: new Date()
};

    servicios.push(nuevoServicio);
    localStorage.setItem(
        "servicios",
        JSON.stringify(servicios)
    );

    // Limpiar formulario después de guardar nuevo registro
document.getElementById("servicio").value = "";
document.getElementById("monto").value = "";
document.getElementById("descuento10").checked = false;
document.getElementById("modoManual").checked = false;
document.getElementById("precioManual").value = "";

cambiarModoManual();

document.querySelectorAll(".adicional").forEach(item => {
    item.checked = false;
});

mostrarFormulario();
actualizarPantalla();
    
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

    servicios = servicios.filter(
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


function mostrarOpciones(){

    const opciones =
        document.getElementById("opciones");

    opciones.classList.toggle("oculto");

}
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
    document.getElementById("nombreArchivo").value.trim();


    if(nombreArchivo === ""){

        nombreArchivo = "NailControl_Respaldo";

    }


    nombreArchivo =
    nombreArchivo.replace(/[\/\\:*?"<>|]/g,"");


    const datos =
    JSON.stringify(servicios,null,2);


    const blob =
    new Blob([datos],{
        type:"application/json"
    });


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


function cerrarModalExportar(){

    document
    .getElementById("modalExportar")
    .classList.add("oculto");

}



function confirmarExportar(){

    let nombreArchivo =
    document.getElementById("nombreArchivo").value.trim();


    if(nombreArchivo === ""){

        nombreArchivo = "NailControl_Respaldo";

    }


    nombreArchivo =
    nombreArchivo.replace(/[\/\\:*?"<>|]/g,"");


    const datos =
    JSON.stringify(servicios,null,2);


    const blob =
    new Blob([datos],{
        type:"application/json"
    });


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
function importarDatos(event){

    const archivo = event.target.files[0];

    if(!archivo){
        return;
    }

    const lector = new FileReader();

    lector.onload = function(e){

        try{

            const datos = JSON.parse(e.target.result);

            servicios = datos;

            localStorage.setItem(
                "servicios",
                JSON.stringify(servicios)
            );

            actualizarPantalla();

            alert("Respaldo restaurado correctamente.");

        }catch(error){

            alert("El archivo no es válido.");
            console.error(error);

        }

    };

    lector.readAsText(archivo);

}
function cerrarModal(){

    document
        .getElementById("modalEliminar")
        .classList.add("oculto");

}
function confirmarEliminar(){

    servicios = servicios.filter(
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

    actualizarPantalla();

function limpiarFiltro(){

    document.getElementById("filtroFecha").value = "";

    actualizarPantalla();

}

function actualizarPantalla(){

    const lista =
        document.getElementById("listaServicios");

    lista.innerHTML = "";

    let total = 0;
    const fechaFiltro =
        document.getElementById("filtroFecha").value;

    servicios.forEach((item, index) => {

 if (fechaFiltro) {

    const fechaServicio = new Date(item.fecha);

    const año = fechaServicio.getFullYear();
    const mes = String(fechaServicio.getMonth() + 1).padStart(2, "0");
    const dia = String(fechaServicio.getDate()).padStart(2, "0");

    const fechaFormateada = `${año}-${mes}-${dia}`;

    if (fechaFormateada !== fechaFiltro) {
        return;
    }
}


        total += item.monto;

        const li =
            document.createElement("li");

        const fecha = new Date(item.fecha);

li.innerHTML = `
<strong>📅 Fecha:</strong> ${fecha.toLocaleDateString('es-CL')}<br>
<strong>🕒 Hora:</strong> ${fecha.toLocaleTimeString('es-CL')}<br>
<strong>👤 Cliente #${item.numeroCliente}</strong><br>
<strong>💅 Servicio:</strong> ${item.servicio}<br>
<strong>💰 Monto:</strong> $${item.monto.toLocaleString('es-CL')}<br><br>
${item.descuento10 ? "<strong>🎁 Descuento:</strong> 10%<br>" : ""}
<button onclick="editarServicio(${item.id})">
    ✏️ Editar
</button>
<button onclick="abrirModalEliminar(${item.id})">
    🗑️ Eliminar
</button>

`;
        lista.appendChild(li);

    });
const resumenPorDia = {};

servicios.forEach(item => {

    const fecha = new Date(item.fecha)
        .toLocaleDateString('es-CL');

    if (!resumenPorDia[fecha]) {
        resumenPorDia[fecha] = 0;
    }

    resumenPorDia[fecha] += item.monto;
});

const listaResumen =
    document.getElementById("resumenDiario");

listaResumen.innerHTML = "";

for (const fecha in resumenPorDia) {

    const li = document.createElement("li");

    li.innerHTML =
        `📅 ${fecha} - 💰 $${resumenPorDia[fecha].toLocaleString('es-CL')}`;

    listaResumen.appendChild(li);
}
    // INGRESO DEL DÍA (según calendario seleccionado)
document.getElementById("hoy").textContent =
    `$${total.toLocaleString('es-CL')}`;


// INGRESO SEMANAL (semana actual)
const fechaActual = new Date();

const inicioSemana = new Date(fechaActual);
inicioSemana.setDate(
    fechaActual.getDate() - fechaActual.getDay() + 1
);
inicioSemana.setHours(0,0,0,0);

const finSemana = new Date(inicioSemana);
finSemana.setDate(inicioSemana.getDate() + 6);
finSemana.setHours(23,59,59,999);


let totalSemana = 0;

servicios.forEach(item => {

    const fechaServicio = new Date(item.fecha);

    if (
        fechaServicio >= inicioSemana &&
        fechaServicio <= finSemana
    ) {
        totalSemana += item.monto;
    }

});


document.getElementById("semana").textContent =
    `$${totalSemana.toLocaleString('es-CL')}`;


// INGRESO MENSUAL (mes actual)
const mesActual = fechaActual.getMonth();
const añoActual = fechaActual.getFullYear();

let totalMes = 0;

servicios.forEach(item => {

    const fechaServicio = new Date(item.fecha);

    if (
        fechaServicio.getMonth() === mesActual &&
        fechaServicio.getFullYear() === añoActual
    ) {
        totalMes += item.monto;
    }

});


document.getElementById("mes").textContent =
    `$${totalMes.toLocaleString('es-CL')}`;
}
window.onload = function () {
    actualizarPantalla();
}
function cambiarModoManual(){

    const manual =
        document.getElementById("modoManual").checked;

    const contenedor =
        document.getElementById("contenedorManual");

    if(manual){

        contenedor.classList.remove("oculto");

        document.getElementById("servicio").disabled = true;

        document.querySelectorAll(".adicional")
            .forEach(item => item.disabled = true);

        document.getElementById("descuento10").disabled = true;

        document.getElementById("monto").value = "";

    }
    else{

        contenedor.classList.add("oculto");

        document.getElementById("servicio").disabled = false;

        document.querySelectorAll(".adicional")
            .forEach(item => item.disabled = false);

        document.getElementById("descuento10").disabled = false;

   document.getElementById("precioManual").value = "";

actualizarMonto();
    }

}
function calcularManual(){

    const precio =
        Number(document.getElementById("precioManual").value);

    const comision =
        Math.round(precio * 0.40);

    document.getElementById("monto").value = comision;

}
