// Элементы DOM
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const startMenu = document.getElementById('startMenu');
        const startButton = document.getElementById('startButton');
        const controlsButton = document.getElementById('controlsButton');
        const difficultySelect = document.getElementById('difficultySelect');
        const highScoreDisplay = document.getElementById('highScoreDisplay');

        // Игровые переменные
        const box = 20;
        let snake = [];
        let food = {};
        let score = 0;
        let d = '';
        let game = null;
        let gameSpeed = 150;
        let highScore = localStorage.getItem('snakeHighScore') || 0;

        // Инициализация игры
        function initGame() {
            snake = [{x: 9 * box, y: 10 * box}];
            generateFood();
            score = 0;
            d = '';
            gameSpeed = parseInt(difficultySelect.value);
            
            // Обновление рекорда
            highScoreDisplay.textContent = `Рекорд: ${highScore}`;
        }

        // Генерация еды
        function generateFood() {
            let foodPosition;
            let isOnSnake = true;
            
            while (isOnSnake) {
                foodPosition = {
                    x: Math.floor(Math.random() * 20) * box,
                    y: Math.floor(Math.random() * 20) * box
                };
                
                isOnSnake = snake.some(segment => 
                    segment.x === foodPosition.x && segment.y === foodPosition.y
                );
            }
            
            food = foodPosition;
        }

        // Отрисовка игры
        function draw() {
            // Очистка холста
            ctx.fillStyle = "#f0f0f0";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Отрисовка змейки
            for(let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i === 0) ? '#4CAF50' : '#8BC34A';
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
                
                ctx.strokeStyle = '#fff';
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }
            
            // Отрисовка еды
            ctx.fillStyle = '#f44336';
            ctx.fillRect(food.x, food.y, box, box);
            
            // Позиция головы змейки
            let snakeX = snake[0].x;
            let snakeY = snake[0].y;
            
            // Направление движения
            if(d === "LEFT") snakeX -= box;
            if(d === "UP") snakeY -= box;
            if(d === "RIGHT") snakeX += box;
            if(d === "DOWN") snakeY += box;
            
            // Если змейка съела еду
            if(snakeX === food.x && snakeY === food.y) {
                score++;
                generateFood();
                
                // Увеличение скорости каждые 5 очков
                if(score % 5 === 0 && gameSpeed > 50) {
                    gameSpeed -= 5;
                    clearInterval(game);
                    game = setInterval(draw, gameSpeed);
                }
                
                // Обновление рекорда
                if(score > highScore) {
                    highScore = score;
                    localStorage.setItem('snakeHighScore', highScore);
                    highScoreDisplay.textContent = `Рекорд: ${highScore}`;
                }
            } else {
                // Удаляем хвост
                snake.pop();
            }
            
            // Новая голова
            let newHead = {x: snakeX, y: snakeY};
            
            // Проверка столкновений
            if(snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || 
               collision(newHead, snake)) {
                gameOver();
                return;
            }
            
            snake.unshift(newHead);
            
            // Отрисовка счета
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("Счет: " + score, 10, 20);
        }

        // Проверка столкновений
        function collision(head, array) {
            for(let i = 0; i < array.length; i++) {
                if(head.x === array[i].x && head.y === array[i].y) {
                    return true;
                }
            }
            return false;
        }

        // Управление
        document.addEventListener('keydown', direction);
        
        function direction(event) {
            if(event.key === "Escape") {
                pauseGame();
                return;
            }
            
            if(!game) return;
            
            if(event.key === "ArrowLeft" && d !== "RIGHT") {
                d = "LEFT";
            } else if(event.key === "ArrowUp" && d !== "DOWN") {
                d = "UP";
            } else if(event.key === "ArrowRight" && d !== "LEFT") {
                d = "RIGHT";
            } else if(event.key === "ArrowDown" && d !== "UP") {
                d = "DOWN";
            }
        }

        // Конец игры
        function gameOver() {
            clearInterval(game);
            alert("Игра окончена! Ваш счет: " + score);
            startMenu.style.display = "flex";
        }

        // Пауза
        function pauseGame() {
            if (!game) return;
            
            if (startMenu.style.display === "flex") {
                startMenu.style.display = "none";
                game = setInterval(draw, gameSpeed);
            } else {
                clearInterval(game);
                startMenu.style.display = "flex";
                document.getElementById('startButton').textContent = "Продолжить";
            }
        }

        // Обработчики событий
        startButton.addEventListener('click', () => {
            if (!game) {
                initGame();
                startMenu.style.display = "none";
                game = setInterval(draw, gameSpeed);
            } else {
                startMenu.style.display = "none";
                game = setInterval(draw, gameSpeed);
            }
        });
        
        controlsButton.addEventListener('click', () => {
            alert("Управление:\n\nСтрелки - движение змейки\nEscape - пауза");
        });

        // Инициализация при загрузке
        highScoreDisplay.textContent = `Рекорд: ${highScore}`;