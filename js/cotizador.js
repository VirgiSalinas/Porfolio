//DOM
const form = document.getElementById("cotizadorForm");
const selectServicio = document.getElementById("servicio");
const resultado = document.getElementById("resultado");

//variables globales
let servicios = [];
let extras = [];
let datosListos = false

//carga de datos (json)
async function cargarDatos() {
    try {
        const response = await fetch("../data/servicios.json");

        if (!response.ok) {
            throw new Error("No se pudo cargar el archivo JSON");
        }

        const data = await response.json();
        servicios = data.servicios;
        extras = data.extras;
        datosListos = true
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "No se pudieron cargar los servicios. Por favor recargá la página.",
            icon: "error",
            confirmButtonColor: "#6b6b3f"
        });
    }
}

//Función para calcular cotización
function calcularCotizacion(servicioId, CheckboxesSeleccionados) {
    const servicioBase = servicios.find(
        servicio => servicio.id === servicioId
    );

    if (!servicioBase) {
        return null;
    }

    let total = servicioBase.precio;
    let extrasDetalle = "";

    CheckboxesSeleccionados.forEach(extraCheck => {
        const extraEncontrado = extraCheck.find(
            extra => extra.id === extraCheck.value
        );

        if (extraEncontrado) {
            total += extraEncontrado.precio;
            extrasDetalle += `<li>${extraEncontrado.nombre}: +$${extraEncontrado.precio.toLocalString('es-AR')}</li>`;
        }
    });

    return {
        servicioBase,
        total,
        extrasDetalle,
    };
}


// Evento principal del formulario
form.addEventListener("submit", (e) => {
    e.preventDefault();

    //verificar que los datos esten cargados
    if (!datosListos) {
        Swal.fire({
            title: "Cargando...",
            text: "Por favor esperá un momento mientras se cargan los datos.",
            icon: "warning",
            confirmButtonColor: "#6b6b3f"
        });

        return;
    }

    const servicioSeleccionado = selectServicio.value;

    //validacion del servicio
    if (servicioSeleccionado === "") {
        resultado.innerHTML = "<p>Por favor seleccioná un servicio.</p>";

        Swal.fire({
            title: "Atención",
            text: "Debés seleccionar un servicio antes de cotizar.",
            icon: "warning",
            confirmButtonColor: "#6b6b3f"
        });
        return;
    }


    //Obtener extras seleccionados 
    const extrasSeleccionados = document.querySelectorAll (
        "input[type='checkbox']:checked"
    );

    //Calcular cotizacion
    const cotizacion = calcularCotizacion(servicioSeleccionado, extrasSeleccionados);

    if (!cotizacion) {
        resultado.innerHTML = "<p>Error al procesar la cotización.</p";
        return
    }

    //Mostrar resultado 
    resultado.innerHTML = `
    <p><strong>Servicio:</strong> ${cotizacion.servicioBase.nombre}</p>
    <p><strong>Precio base:</strong> $${cotizacion.servicioBase.precio.toLocalString('es-AR')}</p>
    
    ${
        cotizacion.extrasDetalle
        ? `<p><strong>Extras:</strong></p><ul>${cotizacion.extrasDetalle}</ul>`
        : "<p>Sin extras seleccionados</p>"
    }
    
    <p class="total"><strong>TOTAL:</strong> $${cotizacion.total.toLocalString('es-AR')}</p>`;

    //Alerta de confirmacion
    Swal.fire({
    title: "¡Cotización generada!",
    text: `Total: $${cotizacion.total.toLocaleString('es-AR')}`,
    icon: "success",
    confirmButtonColor: "#6b6b3f"
  });
});

//Datos del cliente precargados
document.addEventListener("DOMContentLoaded", () => {
    const nombreInput = document.getElementById("nombre");
    const emailInput = document.getElementById("email");

    //Precargar datos del cliente
    nombreInput.value = "Virginia Salinas";
    emailInput.value = "virgisalinas5@gmail.com";

    //Cargar datos de servicios
    cargarDatos();
});