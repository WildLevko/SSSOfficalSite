// Канвас
const canvas = document.getElementById('qqq');
const c = canvas.getContext('2d');

// Перевірка на мобільний пристрій
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const speedMultiplier = isMobile ? 0.67 : 1; // 1.5x повільніше на мобільних

// Змінні
const paddle = { x: 350, width: 100, height: 10 };
const balls = [{ x: 400, y: 300, radius: 10, dx: 4 * speedMultiplier, dy: -4 * speedMultiplier }];
let greenBall = null;
let rightPressed = false, leftPressed = false;
let score = 0;
let lives = 3;
const initialSpeed = 4 * speedMultiplier;
const maxSpeed = 8 * speedMultiplier;
let paddleResized = false;
let gameRunning = true;

// Керування клавішами
document.addEventListener('keydown', (e) => {
    if (['ArrowRight', 'd', 'в'].includes(e.key)) rightPressed = true;
    if (['ArrowLeft', 'a', 'ф'].includes(e.key)) leftPressed = true;
});

document.addEventListener('keyup', (e) => {
    if (['ArrowRight', 'd', 'в'].includes(e.key)) rightPressed = false;
    if (['ArrowLeft', 'a', 'ф'].includes(e.key)) leftPressed = false;
});

// Керування мишею та дотиком
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    paddle.x = Math.max(0, Math.min(e.clientX - rect.left - paddle.width / 2, canvas.width - paddle.width));
});

canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    paddle.x = Math.max(0, Math.min(touchX - paddle.width / 2, canvas.width - paddle.width));
    e.preventDefault();
}, { passive: false });

// Малювання
function drawRect(x, y, w, h) { c.fillStyle = 'white'; c.fillRect(x, y, w, h); }
function drawCircle(x, y, r, color) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = color; c.fill(); }
function drawText(text, x, y) { c.fillStyle = 'white'; c.font = '20px Cursive'; c.fillText(text, x, y); }

function getRandomSpeed() {
    const speed = (Math.random() * (maxSpeed - initialSpeed) + initialSpeed) * speedMultiplier;
    return Math.random() > 0.5 ? speed : -speed;
}

function resetBall(ball) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = getRandomSpeed();
    ball.dy = getRandomSpeed();
}

function addNewBall() {
    if (balls.length < 2) {
        balls.push({ x: canvas.width / 2, y: canvas.height / 2, radius: 10, dx: getRandomSpeed(), dy: getRandomSpeed() });
    }
}

function spawnGreenBall() {
    if (score >= 25 && Math.random() < 0.5 && !greenBall) {
        greenBall = { x: Math.random() * canvas.width, y: 0, radius: 10, dy: (Math.random() * 4 + 6) * speedMultiplier };
    }
}
setInterval(spawnGreenBall, 3000);

function update() {
    if (!gameRunning) return;

    balls.forEach((ball) => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) ball.dx *= -1;
        if (ball.y < ball.radius) ball.dy *= -1;

        if (ball.y > canvas.height - paddle.height && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy *= -1;
            score += 1;
        }

        if (ball.y > canvas.height) {
            lives -= 1;
            if (lives === 0) {
                gameRunning = false;
                confirm(`Loss. Your score: ${score}`);
                document.location.reload();
            } else {
                resetBall(ball);
            }
        }
    });

    if (greenBall) {
        greenBall.y += greenBall.dy;
        if (greenBall.y > canvas.height - paddle.height && greenBall.x > paddle.x && greenBall.x < paddle.x + paddle.width) {
            greenBall.dy = -5 * speedMultiplier;
            score += 1;
            if (Math.random() < 0.2) lives += 1;
            setTimeout(() => { greenBall = null; }, 500);
        }
        if (greenBall.y > canvas.height) {
            lives -= 1;
            greenBall = null;
        }
        if (lives<=0){
    
            gameRunning = false;
                confirm(`Loss. Your score: ${score}`);
                document.location.reload();
        }
    }

    if (score === 10 && !paddleResized) {
        addNewBall();
        if (paddle.width + 100 <= canvas.width) paddle.width += 100;
        paddleResized = true;
    }

    if (rightPressed && paddle.x < canvas.width - paddle.width) paddle.x += 7;
    if (leftPressed && paddle.x > 0) paddle.x -= 7;
}

function draw() {
    if (!gameRunning) return;
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    balls.forEach((ball, index) => drawCircle(ball.x, ball.y, ball.radius, index === 0 ? 'blue' : 'red'));
    if (greenBall) drawCircle(greenBall.x, greenBall.y, greenBall.radius, 'green');
    drawText(`Score: ${score}`, 10, 20);
    drawText(`Lives: ${lives}`, canvas.width - 100, 20);
    update();
    requestAnimationFrame(draw);
}
draw();
