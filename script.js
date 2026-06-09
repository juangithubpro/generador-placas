// Captura de elementos del DOM
const inputTitulo = document.getElementById('input-titulo');
const inputCategoria = document.getElementById('input-categoria');
const checkLuto = document.getElementById('check-luto');
const inputFoto = document.getElementById('input-foto');

const placaObjetivo = document.getElementById('placa-objetivo');
const placaTitulo = document.getElementById('placa-titulo');
const placaCategoria = document.getElementById('placa-categoria');
const placaFoto = document.getElementById('placa-foto');

// ✍️ 1. Sincronizar texto del Título
inputTitulo.addEventListener('input', () => {
    placaTitulo.innerText = inputTitulo.value.toUpperCase() || "TÍTULO DE LA NOTICIA DE EJEMPLO";
});

// 🏷️ 2. Sincronizar texto de la Categoría
inputCategoria.addEventListener('input', () => {
    placaCategoria.innerText = inputCategoria.value.toUpperCase() || "NOTICIAS";
});

// 🖤 3. Controlar activación de Luto
checkLuto.addEventListener('change', () => {
    if (checkLuto.checked) {
        placaObjetivo.classList.add('es-luto');
    } else {
        placaObjetivo.classList.add('es-luto'); // Mantiene estructura unificada
        placaObjetivo.className = "placa-sp-wrapper es-luto"; 
        // Si destildan luto vuelve al clásico
        if(!checkLuto.checked) {
            placaObjetivo.className = "placa-sp-wrapper";
        }
    }
});

// 🖼️ 4. Procesar y cargar la foto seleccionada localmente
inputFoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            placaFoto.style.backgroundImage = `url('${event.target.result}')`;
        };
        reader.readAsDataURL(file);
    }
});

// 📥 5. Función de Descargar con Canvas
async function descargarPlaca() {
    const originalText = document.querySelector('.btn-descarga-sp').innerHTML;
    const boton = document.querySelector('.btn-descarga-sp');
    boton.innerHTML = "Procesando... ⏳";
    boton.disabled = true;

    try {
        const canvas = await html2canvas(placaObjetivo, {
            useCORS: true,
            allowTaint: false,
            scale: 3, // Alta calidad para Instagram
            backgroundColor: "#000000"
        });

        const link = document.createElement("a");
        link.download = "Placa-NadaDigital.png";
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
    } catch (err) {
        console.error(err);
        alert("Error al generar la imagen.");
    }
    
    boton.innerHTML = originalText;
    boton.disabled = false;
}

// 📤 6. Función de Compartir Nativo (Para celulares)
async function compartirPlaca() {
    const boton = document.querySelector('.btn-share-sp');
    const originalText = boton.innerHTML;
    boton.innerHTML = "Preparando... ⏳";
    boton.disabled = true;

    try {
        const canvas = await html2canvas(placaObjetivo, {
            useCORS: true,
            allowTaint: false,
            scale: 3,
            backgroundColor: "#000000"
        });

        canvas.toBlob(async function(blob) {
            const file = new File([blob], "placa.png", { type: "image/png" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: "Nueva Placa",
                    text: "Generado desde el panel de Nada Digital"
                });
            } else {
                alert("Tu navegador o dispositivo no permite compartir directo. Usá el botón Descargar.");
            }
            boton.innerHTML = originalText;
            boton.disabled = false;
        }, "image/png");

    } catch (err) {
        console.error(err);
        alert("Error al compartir.");
        boton.innerHTML = originalText;
        boton.disabled = false;
    }
}