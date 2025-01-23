// Канвас
const canvas = document.getElementById('qqq');
const c = canvas.getContext('2d');

// Змінні
const paddle = { x: 350, width: 100, height: 10 };
const balls = [{ x: 400, y: 300, radius: 10, dx: 4, dy: -4 }];
let rightPressed = false, leftPressed = false;
let mouseX = 0; // Для хранения координаты мыши
let score = 0;
let lives = 3; 
const initialSpeed = 4; 
const maxSpeed = 10; 
let paddleResized = false; 

// Керування клавішами
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = true;
    if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = false;
    if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = false;
});

// Керування мишею
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;

    // Центрируем платформу относительно мыши
    paddle.x = Math.max(0, Math.min(mouseX - paddle.width / 2, canvas.width - paddle.width));
});

// Малювання
function drawRect(x, y, w, h) { c.fillStyle = 'white'; c.fillRect(x, y, w, h); }

function drawCircle(x, y, r, color) {
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fillStyle = color;
    c.fill();
}

function drawText(text, x, y) { c.fillStyle = 'white'; c.font = '20px Cursive'; c.fillText(text, x, y); }

// Функція для генерації випадкової швидкості
function getRandomSpeed() {
    const speed = Math.random() * (maxSpeed - initialSpeed) + initialSpeed;
    return Math.random() > 0.5 ? speed : -speed;
}

// Скидання м'яча
function resetBall(ball) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = getRandomSpeed();
    ball.dy = getRandomSpeed();
}

// Додаємо новий м'яч, якщо їх менше двох
function addNewBall() {
    if (balls.length < 2) {
        balls.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 10,
            dx: getRandomSpeed(),
            dy: getRandomSpeed()
        });
    }
}

// Оновлення
function update() {
    balls.forEach((ball, index) => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Відскок від стінок
        if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) ball.dx *= -1;
        if (ball.y < ball.radius) ball.dy *= -1;

        // Відскок від платформи
        if (
            ball.y > canvas.height - paddle.height &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
        ) {
            ball.dy *= -1;

            // Збільшуємо швидкість, але з перевіркою на максимум
            ball.dx = Math.min(Math.max(ball.dx - 1.0, -maxSpeed), maxSpeed);
            ball.dy = Math.min(Math.max(ball.dy - 1.0, -maxSpeed), maxSpeed);

            score += 1;

            // Перевірка на максимальну швидкість
            if (Math.abs(ball.dx) >= maxSpeed && Math.abs(ball.dy) >= maxSpeed) {
                // Скидаємо швидкість м'ячів
                balls.forEach((b) => {
                    b.dx = initialSpeed * (b.dx > 0 ? 1 : -1);
                    b.dy = initialSpeed * (b.dy > 0 ? 1 : -1);
                });
            }
        }

        // Програш
        if (ball.y > canvas.height) {
            lives -= 1; // Зменшуємо кількість життів
            if (lives === 0) {
                confirm(`Loss. Your score: ${score}`);
                document.location.reload();
            } else {
                resetBall(ball); // Скидаємо позицію м'яча
            }
        }
    });

    // Збільшення платформи відбувається тільки один раз, коли рахунок 10
    if (score === 10 && !paddleResized) {
        addNewBall();
        // Збільшуємо ширину платформи на 100px і чи вона не перебільшує канвас
        if (paddle.width + 100 <= canvas.width) {
            paddle.width += 100; // Збільшуємо ширину платформи
        }
        paddleResized = true; // дивимо чи платформа збільшилась
    }

    // Рух платформи
    if (rightPressed && paddle.x < canvas.width - paddle.width) paddle.x += 7;
    if (leftPressed && paddle.x > 0) paddle.x -= 7;
}

// Цикл гри
function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    // Малюємо платформу, м'ячі, рахунок та життя
    drawRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    balls.forEach((ball, index) => {
        // Колір м'яча
        const ballColor = index === 0 ? 'blue' : 'red';
        drawCircle(ball.x, ball.y, ball.radius, ballColor);
    });
    drawText(`Score: ${score}`, 10, 20);
    drawText(`Lives: ${lives}`, canvas.width - 100, 20);

    update();
    requestAnimationFrame(draw);
}

draw();





