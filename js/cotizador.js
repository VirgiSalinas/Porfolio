//DOM
const form = document.getElementById("cotizadorForm");
const selectServicio = document.getElementById("servicio");
const resultado = document.getElementById("resultado");

//variables globales
let servicios = [];
let extras = [];
let datosListos = false;

//carga de datos (json)
async function cargarDatos() {
    try {
        const response = await fetch("../data/servicios.json");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        servicios = data.servicios;
        extras = data.extras;
        datosListos = true;

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
function calcularCotizacion(servicioId, checkboxesSeleccionados) {
    const servicioBase = servicios.find(
        servicio => servicio.id === servicioId
    );

    if (!servicioBase) {
        return null;
    }

    let total = servicioBase.precio;
    let extrasDetalle = "";

    checkboxesSeleccionados.forEach(extraCheck => {
        const extraEncontrado = extras.find(
            extra => extra.id === extraCheck.value
        );

        if (extraEncontrado) {
            total += extraEncontrado.precio;
            extrasDetalle += `<li>${extraEncontrado.nombre}: +$${extraEncontrado.precio.toLocaleString('es-AR')}</li>`;
        }
    });

    return {
        servicioBase,
        total,
        extrasDetalle
    };
}

//Evento principal del formulario
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
    const extrasSeleccionados = document.querySelectorAll(
        "input[type='checkbox']:checked"
    );

    //Calcular cotizacion
    const cotizacion = calcularCotizacion(servicioSeleccionado, extrasSeleccionados);

    if (!cotizacion) {
        resultado.innerHTML = "<p>Error al procesar la cotización.</p>";
        return;
    }

    //Mostrar resultado
    resultado.innerHTML = `
        <p><strong>Servicio:</strong> ${cotizacion.servicioBase.nombre}</p>
        <p><strong>Precio base:</strong> $${cotizacion.servicioBase.precio.toLocaleString('es-AR')}</p>

        ${
            cotizacion.extrasDetalle
                ? `<p><strong>Extras:</strong></p><ul>${cotizacion.extrasDetalle}</ul>`
                : "<p>Sin extras seleccionados</p>"
        }

        <p class="total"><strong>TOTAL:</strong> $${cotizacion.total.toLocaleString('es-AR')}</p>
    `;

    //Alerta de confirmacion
    Swal.fire({
        title: "¡Cotización generada!",
        text: `Total: $${cotizacion.total.toLocaleString('es-AR')}`,
        icon: "success",
        confirmButtonColor: "#6b6b3f"
    });
});

// Formulario de contacto
const formContacto = document.getElementById("formContacto");
const cotizacionGuardada = document.getElementById("cotizacionGuardada");

let ultimaCotizacion = null;

// Modificar el evento del formulario principal para guardar la cotización
form.addEventListener("submit", (e) => {
    e.preventDefault();

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

    const extrasSeleccionados = document.querySelectorAll(
        "input[type='checkbox']:checked"
    );

    const cotizacion = calcularCotizacion(servicioSeleccionado, extrasSeleccionados);

    if (!cotizacion) {
        resultado.innerHTML = "<p>Error al procesar la cotización.</p>";
        return;
    }

    // Guardar cotización para enviar después
    ultimaCotizacion = cotizacion;

    resultado.innerHTML = `
        <p><strong>Servicio:</strong> ${cotizacion.servicioBase.nombre}</p>
        <p><strong>Precio base:</strong> $${cotizacion.servicioBase.precio.toLocaleString('es-AR')}</p>

        ${
            cotizacion.extrasDetalle
                ? `<p><strong>Extras:</strong></p><ul>${cotizacion.extrasDetalle}</ul>`
                : "<p>Sin extras seleccionados</p>"
        }

        <p class="total"><strong>TOTAL:</strong> $${cotizacion.total.toLocaleString('es-AR')}</p>
    `;

    Swal.fire({
        title: "¡Cotización generada!",
        text: `Total: $${cotizacion.total.toLocaleString('es-AR')}`,
        icon: "success",
        confirmButtonColor: "#6b6b3f"
    });

    // Scroll suave hacia el formulario de contacto
    document.querySelector('.datos-cliente').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
});

// Evento para guardar cotización con datos del cliente
formContacto.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!ultimaCotizacion) {
        Swal.fire({
            title: "Atención",
            text: "Primero debés generar una cotización.",
            icon: "warning",
            confirmButtonColor: "#6b6b3f"
        });
        return;
    }

    const datosCliente = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value || "No proporcionado",
        empresa: document.getElementById("empresa").value || "No proporcionado",
        mensaje: document.getElementById("mensaje").value || "Sin mensaje",
        cotizacion: ultimaCotizacion
    };

    // Guardar en localStorage
    const cotizacionesGuardadas = JSON.parse(localStorage.getItem("cotizaciones")) || [];
    cotizacionesGuardadas.push({
        ...datosCliente,
        fecha: new Date().toLocaleString('es-AR')
    });
    localStorage.setItem("cotizaciones", JSON.stringify(cotizacionesGuardadas));

    // Mostrar mensaje de éxito
    Swal.fire({
        title: "¡Cotización enviada!",
        html: `
            <p>Hola <strong>${datosCliente.nombre}</strong>,</p>
            <p>Tu cotización de <strong>$${ultimaCotizacion.total.toLocaleString('es-AR')}</strong> fue registrada.</p>
            <p>Te contactaremos a la brevedad a <strong>${datosCliente.email}</strong></p>
        `,
        icon: "success",
        confirmButtonColor: "#6b6b3f"
    });

    // Mostrar confirmación visual
    formContacto.style.display = "none";
    cotizacionGuardada.style.display = "block";

    // Reiniciar después de 3 segundos
    setTimeout(() => {
        formContacto.reset();
        formContacto.style.display = "block";
        cotizacionGuardada.style.display = "none";
        ultimaCotizacion = null;
    }, 3000);
});

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    cargarDatos();
});