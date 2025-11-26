
        // --- 1. Definición de los Ejercicios ---
        const exercises = [
            {
                title: "🕵️ ¿Dónde se equivocó Alex?",
                description: "Alex intentó resolver la ecuación 2x + 3 = 9, pero cometió un error. ¡Ayúdalo a encontrarlo!",
                steps: [
                    "Ecuación Original: 2x + 3 = 9",
                    "➡️ Paso 1: 2x = 9 + 3",
                    "➡️ Paso 2: 2x = 12",
                    "➡️ Paso 3: x = 6"
                ],
                options: ["Paso 1", "Paso 2", "Paso 3"],
                correctOptionIndex: 0, 
                feedback: {
                    correct: "✅ ¡Excelente! Detectaste el error en el <strong>Paso 1</strong>. Alex sumó 3 en ambos lados en lugar de restar."
                             + "<br><br><strong>Aprendizaje Clave (Constructivismo):</strong> Para eliminar el '+3' del lado izquierdo y despejar '2x', debemos aplicar la operación inversa."
                             + "<br><br><strong>Conexión (Propiedad de la Igualdad):</strong> Lo opuesto a sumar 3 es restar 3. Para mantener la ecuación balanceada, restamos 3 en AMBOS lados: (2x + 3) - 3 = 9 - 3, lo que nos da <strong>2x = 6</strong>.",
                    
                    incorrect: "❌ No exactamente. Vuelve a mirar el <strong>Paso 1</strong>."
                             + "<br><br><strong>Pista (Reflexión):</strong> Fíjate en el '+3' de la ecuación original. Cuando 'pasó' al otro lado, ¿qué operación debió hacerse? ¿Sumar o restar? Recuerda las operaciones inversas."
                }
            },
            {
                title: "🔍 ¡El Caso de la División!",
                description: "Ahora, Alex resolvió x/2 + 4 = 7. Cometió un error diferente. ¿Dónde está?",
                steps: [
                    "Ecuación Original: x/2 + 4 = 7",
                    "➡️ Paso 1: x/2 = 7 - 4",
                    "➡️ Paso 2: x/2 = 3",
                    "➡️ Paso 3: x = 3 - 2",
                    "➡️ Paso 4: x = 1"
                ],
                options: ["Paso 1", "Paso 2", "Paso 3", "Paso 4"],
                correctOptionIndex: 2, 
                feedback: {
                    correct: "✅ ¡Muy bien! El error está en el <strong>Paso 3</strong>. El '2' estaba dividiendo a la 'x' (x/2)."
                             + "<br><br><strong>Aprendizaje Clave (Aprendizaje Significativo):</strong> Para deshacer una división (x dividido 2), debemos usar la operación inversa: la multiplicación."
                             + "<br><br><strong>Conexión (Propiedad de la Igualdad):</strong> Para despejar 'x', debíamos multiplicar AMBOS lados por 2: (x/2) * 2 = 3 * 2, lo que nos da <strong>x = 6</strong>.",
                    
                    incorrect: "❌ Revisa de nuevo. Los primeros pasos (Paso 1 y 2) parecen correctos al mover el '+4'."
                             + "<br><br><strong>Pista (Reflexión):</strong> El error ocurre al final, al intentar deshacer 'x/2'. Si el 2 está dividiendo, ¿debe pasar al otro lado restando o... haciendo su operación opuesta?"
                }
            },
        ];

        // --- 2. Referencias a Elementos del DOM ---
        const introScreen = document.getElementById('intro-screen');
        const gameScreen = document.getElementById('game-screen');
        const countdownScreen = document.getElementById('countdown-screen');
        const countdownText = document.getElementById('countdown-text');
        const activityTitle = document.getElementById('activity-title');
        const problemDescription = document.getElementById('problem-description');
        const equationContainer = document.getElementById('equation-container');
        const optionsContainer = document.getElementById('options-container');
        const feedbackContainer = document.getElementById('feedback-container');
        const feedbackTitle = document.getElementById('feedback-title');
        const feedbackText = document.getElementById('feedback-text');
        const nextButton = document.getElementById('next-button');
        const timerDisplay = document.getElementById('timer-display'); 

        // --- 3. Lógica del Temporizador y Juego ---
        let currentExerciseIndex = 0;
        let timerID; 
        let countdownInterval; 
        const timeLimit = 18;

        // NUEVA FUNCIÓN: Muestra el conteo 3, 2, 1, ¡Vamos!
        function showCountdown(callback) {
            countdownScreen.classList.add('active');
            const counts = ['3', '2', '1', '¡Vamos!'];
            let currentCount = 0;

            function displayNext() {
                if (currentCount < counts.length) {
                    const number = counts[currentCount];
                    countdownText.textContent = number;
                    
                    // Aplicar clase apropiada
                    if (number === '¡Vamos!') {
                        countdownText.className = 'countdown-go';
                    } else {
                        countdownText.className = 'countdown-number';
                    }
                    
                    currentCount++;
                    
                    // Si es el último (¡Vamos!), esperar menos tiempo
                    const delay = (number === '¡Vamos!') ? 700 : 1000;
                    setTimeout(displayNext, delay);
                } else {
                    // Terminar conteo
                    countdownScreen.classList.remove('active');
                    callback();
                }
            }

            displayNext();
        }

        // Función: Inicia el juego
        function startGame() {
            introScreen.style.opacity = '0';
            introScreen.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                introScreen.style.display = 'none';
                gameScreen.classList.add('active');
                
                // Mostrar conteo antes del primer ejercicio
                showCountdown(() => {
                    loadExercise(currentExerciseIndex);
                });
            }, 300);
        }
        window.startGame = startGame;

        // Función llamada cuando los 10 segundos expiran
        function handleTimeout(exercise) {
            clearInterval(countdownInterval);
            checkAnswer(null, exercise.correctOptionIndex, exercise.feedback, true);
        }

        // Función para iniciar el contador visual
        function startCountdown() {
            let timeLeft = timeLimit;
            timerDisplay.textContent = `${timeLeft}s`;
            timerDisplay.classList.remove('low');
            timerDisplay.style.animation = 'none';
            timerDisplay.offsetHeight;
            timerDisplay.style.animation = '';

            countdownInterval = setInterval(() => {
                timeLeft -= 1;
                timerDisplay.textContent = `${timeLeft}s`;
                
                if (timeLeft <= 3) {
                    timerDisplay.classList.add('low');
                }

                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    timerDisplay.textContent = '0s';
                }
            }, 1000);
        }

        // Función para cargar un ejercicio en la pantalla
        function loadExercise(index) {
            const exercise = exercises[index];

            // 1. Resetear la UI y borrar timers anteriores
            activityTitle.textContent = exercise.title;
            problemDescription.textContent = exercise.description;
            equationContainer.innerHTML = '';
            optionsContainer.innerHTML = '';
            
            clearTimeout(timerID);
            clearInterval(countdownInterval);
            
            feedbackContainer.classList.remove('show', 'correct', 'incorrect');
            feedbackTitle.textContent = '';
            feedbackText.innerHTML = '';
            nextButton.style.display = 'none';

            // Resetear y empezar el temporizador
            timerDisplay.style.display = 'inline';
            startCountdown();
            timerID = setTimeout(() => handleTimeout(exercise), timeLimit * 1000);

            // 2. Cargar los pasos de la ecuación
            exercise.steps.forEach((step, i) => {
                const stepElement = document.createElement('div');
                stepElement.textContent = step;
                if (i === 0) {
                    stepElement.classList.add('original-equation');
                }
                equationContainer.appendChild(stepElement);
            });

            // 3. Cargar los botones de opción
            exercise.options.forEach((optionText, i) => {
                const button = document.createElement('button');
                button.textContent = optionText;
                button.classList.add('option-button');
                
                button.addEventListener('click', () => {
                    checkAnswer(i, exercise.correctOptionIndex, exercise.feedback, false);
                });
                
                optionsContainer.appendChild(button);
            });
        }

        // Función para comprobar la respuesta
        function checkAnswer(selectedIndex, correctIndex, feedback, isTimeout = false) {
            clearTimeout(timerID);
            clearInterval(countdownInterval);
            timerDisplay.style.display = 'none';

            const allButtons = optionsContainer.querySelectorAll('.option-button');
            
            allButtons.forEach(btn => btn.disabled = true);
            
            setTimeout(() => {
                feedbackContainer.classList.add('show');
                nextButton.style.display = 'block';
            }, 100);

            if (isTimeout || selectedIndex !== correctIndex) {
                feedbackContainer.classList.remove('correct');
                feedbackContainer.classList.add('incorrect');
                
                if (selectedIndex !== null) {
                    allButtons[selectedIndex].classList.add('incorrect'); 
                }
                allButtons[correctIndex].classList.add('correct'); 

                if (isTimeout) {
                    feedbackTitle.textContent = "⌛ ¡Tiempo Agotado!";
                    feedbackText.innerHTML = "No te preocupes, el tiempo se terminó. El error está en el paso que se resalta en verde. ¡Analiza la pista para aprender de él!<br><br>" + feedback.incorrect;
                } else {
                    feedbackTitle.textContent = "❌ Mmm, no exactamente.";
                    feedbackText.innerHTML = feedback.incorrect;
                }

            } else {
                feedbackContainer.classList.add('correct');
                feedbackContainer.classList.remove('incorrect');
                allButtons[selectedIndex].classList.add('correct');
                feedbackTitle.textContent = "✅ ¡Correcto! Has detectado el error.";
                feedbackText.innerHTML = feedback.correct 
                                       + "<br><br><strong>¡Excelente! Detectaste el error y aprendiste algo nuevo. 💡</strong>";
            }
        }

        // Función para pasar al siguiente ejercicio
        function goToNextExercise() {
            currentExerciseIndex = (currentExerciseIndex + 1) % exercises.length;
            
            // Mostrar conteo antes del siguiente ejercicio
            showCountdown(() => {
                loadExercise(currentExerciseIndex);
            });
        }

        // --- 4. Inicialización ---
        nextButton.addEventListener('click', goToNextExercise);
    