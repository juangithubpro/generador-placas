// Elementos del Panel de Control
const selectDiseno = document.getElementById('select-diseno');
const inputTitulo = document.getElementById('input-titulo');
const inputCategoria = document.getElementById('input-categoria');
const inputDominio = document.getElementById('input-dominio');
const inputLogo = document.getElementById('input-logo');
const inputFoto = document.getElementById('input-foto');

// Elementos de la Placa Real
const placaObjetivo = document.getElementById('placa-objetivo');
const placaTitulo = document.getElementById('placa-titulo');
const placaCategoria = document.getElementById('placa-categoria');
const placaDominio = document.getElementById('placa-dominio');
const placaLogo = document.getElementById('placa-logo');
const placaFoto = document.getElementById('placa-foto');

// 🔄 1. Selector Dinámico de Diseño (Alterna clases sin chocar)
selectDiseno.addEventListener('change', () => {
    const valorSeleccionado = selectDiseno.value;
    
    // Limpiamos las clases previas de diseño
    placaObjetivo.className = "placa-sp-wrapper";

    if (valorSeleccionado === 'luto') {
        placaObjetivo.classList.add('diseno-luto');
    } 
    else if (valorSeleccionado === 'municipal') {
        placaObjetivo.classList.add('diseno-municipal');
        
        // Auto-completado del dominio municipal en mayúsculas institucionales
        if (inputDominio && placaDominio) {
            inputDominio.value = "SAENZPENA.GOB.AR";
            placaDominio.innerText = "SAENZPENA.GOB.AR";
        }
    } 
    else {
        // Por defecto o deportivo
        placaObjetivo.classList.add('diseno-deportivo');
    }
});

// ✍️ 2. Sincronizar Título (Siempre en mayúsculas estables)
inputTitulo.addEventListener('input', () => {
    placaTitulo.innerText = inputTitulo.value.toUpperCase() || "TÍTULO DE LA NOTICIA";
});

// 🏷️ 3. Sincronizar Categoría o Años
inputCategoria.addEventListener('input', () => {
    placaCategoria.innerText = inputCategoria.value.toUpperCase() || "NOTICIAS";
});

// 🌐 4. Sincronizar Dominio Web Editable (Se remueve toLowerCase para que acepte mayúsculas de bloque)
inputDominio.addEventListener('input', () => {
    placaDominio.innerText = inputDominio.value.toUpperCase() || "WWW.NADADIGITAL.COM.AR";
});

// 🚀 5. Lector de Logo Dinámico (Permite subir cualquier PNG al vuelo)
inputLogo.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            placaLogo.style.backgroundImage = `url('${event.target.result}')`;
        };
        reader.readAsDataURL(file);
    }
});

// 🖼️ 6. Lector de la Foto de Fondo
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

// 📥 7. Descargar Placa (Mapeo rígido con Canvas)
async function descargarPlaca() {
    const boton = document.querySelector('.btn-descarga-sp');
    const txtOriginal = boton.innerHTML;
    boton.innerHTML = "Procesando... ⏳"; boton.disabled = true;

    try {
        const canvas = await html2canvas(placaObjetivo, {
            useCORS: true, allowTaint: false, scale: 3, backgroundColor: "#000000"
        });
        const link = document.createElement("a");
        link.download = `Placa-${selectDiseno.value.toUpperCase()}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
    } catch (err) {
        console.error(err); alert("Error al generar el archivo.");
    }
    boton.innerHTML = txtOriginal; boton.disabled = false;
}

// 📤 8. Compartir Nativo Celular
async function compartirPlaca() {
    const boton = document.querySelector('.btn-share-sp');
    const txtOriginal = boton.innerHTML;
    boton.innerHTML = "Preparando... ⏳"; boton.disabled = true;

    try {
        const canvas = await html2canvas(placaObjetivo, {
            useCORS: true, allowTaint: false, scale: 3, backgroundColor: "#000000"
        });
        canvas.toBlob(async function(blob) {
            const file = new File([blob], "placa.png", { type: "image/png" });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: "Placa Generated" });
            } else {
                alert("Dispositivo no compatible con compartir directo. ¡Usá Descargar!");
            }
            boton.innerHTML = txtOriginal; boton.disabled = false;
        }, "image/png");
    } catch (err) {
        console.error(err); boton.innerHTML = txtOriginal; boton.disabled = false;
    }
}