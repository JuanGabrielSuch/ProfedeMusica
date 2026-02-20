// --- DICCIONARIOS DE NOTAS POR NIVEL ---
const niveles = {
    1: [ // Solo Sol y Mi (Clave de Sol)
        { nombre: 'Sol', posicion: '90px', lineaAdicional: false, clave: '🎼' },
        { nombre: 'Mi', posicion: '120px', lineaAdicional: false, clave: '🎼' }
    ],
    2: [ // Escala Do a Do (Clave de Sol)
        { nombre: 'Do grave', posicion: '150px', lineaAdicional: true, clave: '🎼' },
        { nombre: 'Re', posicion: '135px', lineaAdicional: false, clave: '🎼' },
        { nombre: 'Mi', posicion: '120px', lineaAdicional: false, clave: '🎼' },
        { nombre: 'Fa', posicion: '105px', lineaAdicional: false, clave: '🎼' },
        { nombre: 'Sol', posicion: '90px', lineaAdicional: false, clave: '🎼' },
        { nombre: 'La', posicion: '75px', lineaAdicional: false, clave: '🎼' },
        { nombre: 'Si', posicion: '60px', lineaAdicional: false, clave: '🎼' },
        { nombre: 'Do agudo', posicion: '45px', lineaAdicional: false, clave: '🎼' }
    ],
    3: [ // Mezcla locura: Clave de Fa y Sol
        { nombre: 'Sol (Sol)', posicion: '90px', lineaAdicional: false, clave: '🎼' },
        { nombre: 'Do (Sol)', posicion: '45px', lineaAdicional: false, clave: '🎼' },
        { nombre: 'Fa (Fa)', posicion: '30px', lineaAdicional: false, clave: '𝄢' }, // 4ª línea en Clave de Fa
        { nombre: 'Do (Fa)', posicion: '75px', lineaAdicional: false, clave: '𝄢' }, // 2º espacio en Clave de Fa
        { nombre: 'Sol (Fa)', posicion: '120px', lineaAdicional: false, clave: '𝄢' } // 1ª línea en Clave de Fa
    ]
};

let notaActual = {};
let posiciones = { 1: 2, 2: 2, 3: 2 }; // Los 3 caballos empiezan en el 2% (salida)
const meta = 85; // Porcentaje donde está la meta

const elementoNota = document.getElementById('nota');
const elementoMensaje = document.getElementById('mensaje-feedback');
const elementoClave = document.getElementById('clave-musical');
const contenedorBotones = document.getElementById('contenedor-botones');

function iniciarCarrera() {
    // Resetear posiciones
    posiciones = { 1: 2, 2: 2, 3: 2 };
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`caballo-${i}`).style.left = posiciones[i] + '%';
    }
    
    // Mostrar botones y generar la primera nota
    contenedorBotones.style.display = 'flex';
    elementoMensaje.innerText = '¡Que gane el mejor! Atentos...';
    elementoMensaje.style.color = 'var(--text)';
    
    generarNuevaNota();
}

function generarNuevaNota() {
    const nivelSeleccionado = document.getElementById('selector-nivel').value;
    const notasDisponibles = niveles[nivelSeleccionado];

    elementoNota.style.backgroundColor = 'transparent'; 

    // Elegir nota al azar
    const indiceAleatorio = Math.floor(Math.random() * notasDisponibles.length);
    notaActual = notasDisponibles[indiceAleatorio];
    
    // Colocar nota y cambiar la clave si es necesario
    elementoNota.style.top = notaActual.posicion;
    elementoClave.innerText = notaActual.clave;
    
    // Colorear Clave de Fa para que se note el cambio
    elementoClave.style.color = notaActual.clave === '𝄢' ? '#e74c3c' : 'var(--text)';

    // Línea adicional
    if (notaActual.lineaAdicional) {
        elementoNota.classList.add('con-linea-adicional');
    } else {
        elementoNota.classList.remove('con-linea-adicional');
    }
}

function avanzarEquipo(equipo) {
    // Sumamos unos 10 puntos porcentuales de avance (para que la carrera dure unos 8-9 aciertos)
    posiciones[equipo] += 10; 
    
    // Movemos el caballo
    document.getElementById(`caballo-${equipo}`).style.left = posiciones[equipo] + '%';
    
    // Feedback de acierto
    elementoMensaje.innerText = `¡Punto para el Equipo ${equipo}! 👏`;
    elementoNota.style.backgroundColor = '#27ae60'; // Se pinta de verde
    
    // Comprobar si han llegado a la meta
    if (posiciones[equipo] >= meta) {
        elementoMensaje.innerText = `🏆 ¡EL EQUIPO ${equipo} HA GANADO LA CARRERA! 🏆`;
        elementoMensaje.style.color = '#f39c12';
        contenedorBotones.style.display = 'none'; // Ocultamos botones
        return; // Detenemos el juego
    }

    // Generar la siguiente nota tras un segundito
    setTimeout(generarNuevaNota, 1000);
}

function mostrarRespuesta() {
    // Si la profe le da a este botón, chiva la respuesta si nadie lo sabe
    elementoMensaje.innerText = `Pista: Era un ${notaActual.nombre}`;
    elementoNota.style.backgroundColor = '#f39c12'; // Se pinta de naranja
    setTimeout(generarNuevaNota, 2500);
}