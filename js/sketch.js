  const miDiv = document.getElementById('miDiv');
        const p5Canvas = document.getElementById('miDiv2');
        let jsonData = null;  // Almacena los datos JSON

        let input;
        let button;

        function setup() {
            // Inicializar el lienzo p5.js
            const canvas = createCanvas(windowWidth*0.6, windowHeight*0.6);
            canvas.parent('miDiv2');

            // Crear elementos de entrada en el lienzo
            input = createInput();
            input.position(windowWidth*0.6/2, height - 40);

            button = createButton('Enviar');
            button.position(input.x + input.width, height - 40);
            button.mousePressed(enviarMensaje);

            // Iniciar el escáner de código QR
            const qrCodeReader = new Html5Qrcode("reader");

            // Intentar recuperar los datos almacenados en localStorage
            const storedData = localStorage.getItem('qrData');
            if (storedData) {
                jsonData = JSON.parse(storedData);
                mostrarDatosEnP5(jsonData);
            }

            qrCodeReader.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: 250,
                },
                async (decodedText) => {
                    console.log(`Código QR detectado: ${decodedText}`);
                    miDiv.innerHTML = "Escaneando...";

                    try {
                        // Realizar una solicitud para obtener los datos JSON
                        const response = await fetch(decodedText);
                        jsonData = await response.json();

                        console.log("Datos JSON:", jsonData);

                        // Almacenar los datos en localStorage
                        localStorage.setItem('qrData', JSON.stringify(jsonData));

                        // Mostrar los datos en el lienzo p5.js
                        mostrarDatosEnP5(jsonData);
                    } catch (error) {
                        console.error("Error al obtener datos JSON:", error);
                        miDiv.innerHTML = "Error al obtener datos JSON";
                    }
                },
                (errorMessage) => {
                    console.error(`Error: ${errorMessage}`);
                    miDiv.innerHTML = "Error al escanear QR";
                }
            );
        }

        function draw() {
            background(220);

            // Dibujar los datos en el lienzo
            if (jsonData) {
                fill(0);
                textSize(16);

                // Mostrar solo el contenido de los mensajes
                const mensajes = jsonData.map(msg => msg.contenido);
                for (let i = 0; i < mensajes.length; i++) {
                    const yPos = 0;
                    const xPos= 20;
                    text(mensajes[i], xPos, yPos);
                    if(yPos>windowWidth*0.6){
                        yPos=0;
                        xPos=xPos+100;
                    }
                    else yPos = 40 + i * 20;
                }
            }
        }

        // Función para mostrar los datos en el lienzo p5.js
        function mostrarDatosEnP5(data) {
            // Limpiar el lienzo p5.js
            clear();

            // Dibujar los datos en el lienzo
            if (data) {
                fill(0);
                textSize(16);

                // Mostrar solo el contenido de los mensajes
                const mensajes = data.map(msg => msg.contenido);
                for (let i = 0; i < mensajes.length; i++) {
                    const yPos = 40 + i * 20;
                    text(mensajes[i], 20, yPos);
                }
            }
        }

        // Función para enviar mensajes al servidor
        function enviarMensaje() {
            const message = input.value();

            fetch('phpMensaje.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'mensaje=' + encodeURIComponent(message),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                // Mostrar mensaje de éxito o error
                if (data.includes('Mensaje guardado con éxito.')) {
                    // Limpiar el input después de enviar el mensaje
                    input.value('');
                    miDiv.innerHTML = ''; // Limpiar el contenido de miDiv
                    mostrarDatosEnP5(null); // Limpiar el lienzo p5.js
                } else {
                    console.error('Error al enviar el mensaje al servidor: ' + data);
                }
            })
            .catch(error => {
                console.error('Error de red:', error);
            });
        }

        function generateQRCode() {
            const messageId = document.getElementById("text-input").value;
            const qrcode = new QRCode(document.getElementById("qrcode"),messageId);

            // Puedes ajustar el tamaño y otros parámetros del código QR aquí
            qrcode.makeCode(messageId);
        }

        