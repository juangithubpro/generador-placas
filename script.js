// ============================================================
// 1. CONFIGURACIÓN DE MODELOS (ID = nombre de clase CSS)
// ============================================================
const MODELOS = [
    { id: 'diseno-clasico',           nombre: '📰 Clásico (blanco/rojo)' },
    { id: 'diseno-rojo-flotante',     nombre: '🔴 Rojo flotante' },
    { id: 'diseno-c5n',               nombre: '📺 Estilo C5N' },
    { id: 'diseno-gradiente',         nombre: '🌅 Gradiente' },
    { id: 'diseno-gente-pueblo',      nombre: '🏘️ Gente de Pueblo' },
    { id: 'diseno-institucional',     nombre: '🏛️ Institucional' },
    { id: 'diseno-naranja-borde',     nombre: '🟠 Naranja borde' },
];

// ============================================================
// 2. ELEMENTOS DOM
// ============================================================
const selectDiseno = document.getElementById('select-diseno');
const inputTitulo = document.getElementById('input-titulo');
const inputCategoria = document.getElementById('input-categoria');
const inputDominio = document.getElementById('input-dominio');
const inputLogo = document.getElementById('input-logo');
const inputFoto = document.getElementById('input-foto');

const placaObjetivo = document.getElementById('placa-objetivo');
const placaTitulo = document.getElementById('placa-titulo');
const placaCategoria = document.getElementById('placa-categoria');
const placaDominio = document.getElementById('placa-dominio');
const placaLogo = document.getElementById('placa-logo');
const placaFoto = document.getElementById('placa-foto');

// ============================================================
// 3. FUNCIONES DE SELECCIÓN Y APLICACIÓN
// ============================================================

// Rellena el <select> con las opciones de MODELOS
function rellenarSelect() {
    selectDiseno.innerHTML = '';
    MODELOS.forEach(modelo => {
        const option = document.createElement('option');
        option.value = modelo.id;
        option.textContent = modelo.nombre;
        selectDiseno.appendChild(option);
    });
}

// Elige automáticamente un modelo (por defecto el primero)
function elegirModeloAutomatico() {
    // Cambia a aleatorio si prefieres:
    // const indice = Math.floor(Math.random() * MODELOS.length);
    // return MODELOS[indice].id;
    return MODELOS[0].id; // Siempre inicia con el clásico
}

// Aplica un modelo al wrapper y sincroniza el select
function aplicarModelo(idModelo) {
    // Quitar todas las clases de modelo previas
    MODELOS.forEach(m => placaObjetivo.classList.remove(m.id));
    // Añadir la nueva clase
    placaObjetivo.classList.add(idModelo);
    // Sincronizar el select
    selectDiseno.value = idModelo;
}

// ============================================================
// 4. EVENTOS
// ============================================================

window.addEventListener('DOMContentLoaded', () => {
    rellenarSelect();
    const modeloInicial = elegirModeloAutomatico();
    aplicarModelo(modeloInicial);
});

selectDiseno.addEventListener('change', (e) => {
    aplicarModelo(e.target.value);
});

// Sincronización de campos
inputTitulo.addEventListener('input', () => {
    placaTitulo.innerText = inputTitulo.value.toUpperCase() || "TÍTULO DE LA NOTICIA";
});

inputCategoria.addEventListener('input', () => {
    placaCategoria.innerText = inputCategoria.value.toUpperCase() || "NOTICIAS";
});

inputDominio.addEventListener('input', () => {
    placaDominio.innerText = inputDominio.value.toUpperCase() || "WWW.NADADIGITAL.COM.AR";
});

// Lectura de imágenes
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

// ============================================================
// 5. DESCARGA Y COMPARTIR (con tamaño Instagram 1080x1350)
// ============================================================
async function descargarPlaca() {
    const boton = document.querySelector('.btn-descarga-sp');
    const txtOriginal = boton.innerHTML;
    boton.innerHTML = "Procesando... ⏳";
    boton.disabled = true;

    try {
        // Forzamos el tamaño de la placa a 1080x1350 (4:5) para Instagram
        const canvas = await html2canvas(placaObjetivo, {
            useCORS: true,
            allowTaint: false,
            scale: 3,                // Alta calidad
            backgroundColor: "#000000",
            width: 1080,             // Ancho fijo
            height: 1350,            // Alto fijo
            onclone: function(doc) {
                // Ajustamos el tamaño del elemento clonado
                const cloned = doc.getElementById('placa-objetivo');
                if (cloned) {
                    cloned.style.width = '1080px';
                    cloned.style.height = '1350px';
                    cloned.style.maxWidth = 'none';
                    cloned.style.aspectRatio = '4 / 5';
                }
            }
        });
        const link = document.createElement("a");
        link.download = `Placa-${selectDiseno.value.replace('diseno-', '')}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
    } catch (err) {
        console.error(err);
        alert("Error al generar el archivo.");
    }
    boton.innerHTML = txtOriginal;
    boton.disabled = false;
}

async function compartirPlaca() {
    const boton = document.querySelector('.btn-share-sp');
    const txtOriginal = boton.innerHTML;
    boton.innerHTML = "Preparando... ⏳";
    boton.disabled = true;

    try {
        const canvas = await html2canvas(placaObjetivo, {
            useCORS: true,
            allowTaint: false,
            scale: 3,
            backgroundColor: "#000000",
            width: 1080,
            height: 1350,
            onclone: function(doc) {
                const cloned = doc.getElementById('placa-objetivo');
                if (cloned) {
                    cloned.style.width = '1080px';
                    cloned.style.height = '1350px';
                    cloned.style.maxWidth = 'none';
                    cloned.style.aspectRatio = '4 / 5';
                }
            }
        });
        canvas.toBlob(async function(blob) {
            const file = new File([blob], "placa.png", { type: "image/png" });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: "Placa Generated" });
            } else {
                alert("Dispositivo no compatible con compartir directo. ¡Usá Descargar!");
            }
            boton.innerHTML = txtOriginal;
            boton.disabled = false;
        }, "image/png");
    } catch (err) {
        console.error(err);
        boton.innerHTML = txtOriginal;
        boton.disabled = false;
    }
}