const figurasDisponibles = [
            { simbolo: '♩', silaba: 'TA' },       
            { simbolo: '♫', silaba: 'TI-TI' },    
            { simbolo: '𝄽', silaba: 'SHH' }       
        ];

        let contextoAudio = null;
        const btnEscuchar = document.getElementById('btn-escuchar');

        function lanzarDados() {
            const dados = document.querySelectorAll('.dado');
            dados.forEach((dado, index) => {
                dado.classList.remove('activo'); // Por si se quedó alguno iluminado
                dado.classList.add('volteando');
                setTimeout(() => {
                    const figuraAleatoria = figurasDisponibles[Math.floor(Math.random() * figurasDisponibles.length)];
                    dado.innerHTML = `
                        <span class="figura-musical">${figuraAleatoria.simbolo}</span>
                        <span class="sílaba-kodaly">${figuraAleatoria.silaba}</span>
                    `;
                    dado.classList.remove('volteando');
                }, 200 + (index * 50));
            });
        }

        
        // Sonido de la claqueta (Cuenta atrás) - Estilo metrónomo limpio
        function hacerSonidoClaqueta(tiempo) {
            const oscilador = contextoAudio.createOscillator();
            const ganancia = contextoAudio.createGain();
            
            oscilador.type = 'sine'; // Onda suave y limpia
            oscilador.frequency.value = 1000; // Tono agudo claro (1000 Hz)
            
            // Ataque rápido y caída corta para que suene a "clic"
            ganancia.gain.setValueAtTime(0.8, tiempo); 
            ganancia.gain.exponentialRampToValueAtTime(0.001, tiempo + 0.1);
            
            oscilador.connect(ganancia);
            ganancia.connect(contextoAudio.destination);
            
            oscilador.start(tiempo);
            oscilador.stop(tiempo + 0.1);
        }
        // Sonido de la percusión principal
        function hacerSonidoPercusion(tiempo) {
            const oscilador = contextoAudio.createOscillator();
            const ganancia = contextoAudio.createGain();
            oscilador.type = 'triangle'; 
            oscilador.frequency.setValueAtTime(300, tiempo); 
            oscilador.frequency.exponentialRampToValueAtTime(50, tiempo + 0.1); 
            ganancia.gain.setValueAtTime(1, tiempo);
            ganancia.gain.exponentialRampToValueAtTime(0.001, tiempo + 0.1);
            oscilador.connect(ganancia);
            ganancia.connect(contextoAudio.destination);
            oscilador.start(tiempo);
            oscilador.stop(tiempo + 0.1);
        }

        function reproducirRitmo() {
            // Bloqueamos el botón para que no se superpongan audios
            btnEscuchar.disabled = true;
            btnEscuchar.innerText = '⏱️ Escucha...';

            if (!contextoAudio) {
                contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
            }

            const bpm = 80; 
            const tiempoPorPulso = 60 / bpm; // Segundos por pulso
            const milisegundosPorPulso = tiempoPorPulso * 1000; 
            
            let tiempoActual = contextoAudio.currentTime + 0.1; 

            // 1. PROGRAMAR LA CLAQUETA PREVIA (4 golpes)
            for (let i = 0; i < 4; i++) {
                hacerSonidoClaqueta(tiempoActual);
                tiempoActual += tiempoPorPulso;
            }

            // 2. LEER Y PROGRAMAR EL RITMO
            const dados = document.querySelectorAll('.dado');

            dados.forEach((dado, index) => {
                const silaba = dado.querySelector('.sílaba-kodaly').innerText;

                // --- MAGIA VISUAL: Iluminar la carta ---
                // Calculamos en qué milisegundo exacto le toca a esta carta (después de la claqueta)
                const retrasoVisual = (4 * milisegundosPorPulso) + (index * milisegundosPorPulso);
                
                setTimeout(() => {
                    // Apagamos todas y encendemos solo esta
                    dados.forEach(d => d.classList.remove('activo'));
                    dado.classList.add('activo');
                    
                    // Apagarla cuando termine su tiempo y reactivar botón si es la última
                    setTimeout(() => {
                        dado.classList.remove('activo');
                        if (index === 3) {
                            btnEscuchar.disabled = false;
                            btnEscuchar.innerText = '🔊 Escuchar Ritmo';
                        }
                    }, milisegundosPorPulso - 50);

                }, retrasoVisual);

                // --- MAGIA SONORA ---
                if (silaba === 'TA') {
                    hacerSonidoPercusion(tiempoActual);
                } else if (silaba === 'TI-TI') {
                    hacerSonidoPercusion(tiempoActual);
                    hacerSonidoPercusion(tiempoActual + (tiempoPorPulso / 2));
                }
                
                // Avanzamos el reloj de audio un pulso entero para todos (incluido el silencio SHH)
                tiempoActual += tiempoPorPulso; 
            });
        }
    