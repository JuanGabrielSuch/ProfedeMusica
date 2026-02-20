
        let bpm = 90;
        let sonando = false;
        let intervaloId = null;
        let contextoAudio = null;

        // Referencias a los elementos del HTML
        const slider = document.getElementById('bpm-slider');
        const displayBpm = document.getElementById('bpm-valor');
        const btnPlay = document.getElementById('btn-play');
        const indicador = document.getElementById('indicador');

        // Actualizar el número en pantalla cuando movemos el slider
        slider.addEventListener('input', function() {
            bpm = this.value;
            displayBpm.innerText = bpm;
            
            // Si está sonando, reiniciamos el ritmo con la nueva velocidad
            if (sonando) {
                detenerMetronomo();
                iniciarMetronomo();
            }
        });

        // Función para crear el sonido "Tic"
        function hacerClic() {
            // Inicializamos el audio la primera vez (los navegadores obligan a hacerlo tras un clic del usuario)
            if (!contextoAudio) {
                contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Creamos un oscilador (un generador de ondas)
            const oscilador = contextoAudio.createOscillator();
            const ganancia = contextoAudio.createGain(); // Control de volumen

            oscilador.type = 'sine'; // Tipo de onda (suave)
            oscilador.frequency.value = 1000; // Frecuencia aguda (1000 Hz)
            
            // Hacemos que el sonido sea muy corto (percusivo)
            ganancia.gain.setValueAtTime(1, contextoAudio.currentTime);
            ganancia.gain.exponentialRampToValueAtTime(0.001, contextoAudio.currentTime + 0.1);

            oscilador.connect(ganancia);
            ganancia.connect(contextoAudio.destination);

            oscilador.start(contextoAudio.currentTime);
            oscilador.stop(contextoAudio.currentTime + 0.1);

            // Efecto visual: encendemos el círculo
            indicador.classList.add('latido');
            
            // Lo apagamos a los 100 milisegundos
            setTimeout(() => {
                indicador.classList.remove('latido');
            }, 100);
        }

        function iniciarMetronomo() {
            sonando = true;
            btnPlay.innerText = '⏸ Detener';
            btnPlay.classList.add('parar');
            
            // Calculamos cuántos milisegundos hay entre cada golpe
            // Fórmula: 60 segundos * 1000 milisegundos / BPM
            const milisegundosPorGolpe = 60000 / bpm;
            
            // Hacemos el primer clic inmediatamente y luego programamos los siguientes
            hacerClic();
            intervaloId = setInterval(hacerClic, milisegundosPorGolpe);
        }

        function detenerMetronomo() {
            sonando = false;
            btnPlay.innerText = '▶ Iniciar';
            btnPlay.classList.remove('parar');
            clearInterval(intervaloId); // Detiene el bucle
        }

        function toggleMetronomo() {
            if (sonando) {
                detenerMetronomo();
            } else {
                iniciarMetronomo();
            }
        }