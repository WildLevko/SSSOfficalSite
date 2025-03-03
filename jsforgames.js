const canvas = document.getElementById('qqq');
const c = canvas.getContext('2d');


const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const speedMultiplier = isMobile ? 0.67 : 1;

const paddle = { x: 350, width: 100, height: 10 };
const balls = [{ x: 400, y: 300, radius: 10, dx: 4 * speedMultiplier, dy: -4 * speedMultiplier }];
let greenBall = null;
let blueBall = null;
let blackBall = null;
let isAnimating = false; 
let grayBalls = [];
let rightPressed = false, leftPressed = false;
let score = 0;
let lives = 3;
const initialSpeed = 4 * speedMultiplier;
const maxSpeed = 8 * speedMultiplier;
let paddleResized = false;
let gameRunning = true;

document.addEventListener('keydown', (e) => {
    if (['ArrowRight', 'd', 'в'].includes(e.key)) rightPressed = true;
    if (['ArrowLeft', 'a', 'ф'].includes(e.key)) leftPressed = true;
});

document.addEventListener('keyup', (e) => {
    if (['ArrowRight', 'd', 'в'].includes(e.key)) rightPressed = false;
    if (['ArrowLeft', 'a', 'ф'].includes(e.key)) leftPressed = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    paddle.x = Math.max(0, Math.min(mouseX - paddle.width / 2, canvas.width - paddle.width));
});

canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    paddle.x = Math.max(0, Math.min(touchX - paddle.width / 2, canvas.width - paddle.width));
    e.preventDefault(); 
});


function drawRect(x, y, w, h) { c.fillStyle = 'white'; c.fillRect(x, y, w, h); }
function drawCircle(x, y, r, color) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = color; c.fill(); }
function drawText(text, x, y) { c.fillStyle = 'white'; c.font = '20px Cursive'; c.fillText(text, x, y); }

function getRandomSpeed() {
    const speed = (Math.random() * (maxSpeed - initialSpeed) + initialSpeed) * speedMultiplier;
    return Math.random() > 0.5 ? speed : -speed;
}

function spawnGreenBall() {
    if (score >= 25 && Math.random() < 0.5 && !greenBall) {
        greenBall = { x: Math.random() * canvas.width, y: 0, radius: 10, dy: (Math.random() * 4 + 6) * speedMultiplier };
    }
}
setInterval(spawnGreenBall, 3000);

function spawnBlueBall() {
    if (score >= 35 && Math.random() < 0.03 && !blueBall) {
        blueBall = { x: Math.random() * canvas.width, y: 0, radius: 12, dy: 10 * speedMultiplier };
    }
}
setInterval(spawnBlueBall, 1000);

function spawnBlackBall() {
    const chance = score >= 100 ? 0.65 : score >= 50 ? 0.45 : 0; 
    if (Math.random() < chance && !blackBall) {
        blackBall = { 
            x: Math.random() * canvas.width, 
            y: 0, 
            radius: 14, 
            dy: 3 * speedMultiplier, 
            caught: false 
        };
    }
}
setInterval(spawnBlackBall, 900);

function animateBlackBall() {
    isAnimating = true;
    let colors = ["red", "orange", "yellow"];
    let index = 0;
    let animationDuration = 3000;
    let elapsedTime = 0;

    let animationInterval = setInterval(() => {
        if (elapsedTime >= animationDuration) {
            clearInterval(animationInterval);
            isAnimating = false;
            lives -= 1;
            blackBall = null;
        } else {
            blackBall.radius += 0.5;
            blackBall.color = colors[index % colors.length];
            index++;
            elapsedTime += 100;
        }
    }, 100);
}
function spawnGrayBalls() {
    let radius;
    let speed;

    if (score >= 300) {
        radius = 4;
        speed = 8 * speedMultiplier; 
    }
    else if (score >= 250) {
        radius = 5;
        speed = 7 * speedMultiplier; 
    }
    else if (score >= 200) {
        radius = 6;
        speed = 5 * speedMultiplier; 
    }
    else if (score >= 150) {
        radius = 6;
        speed = 5 * speedMultiplier; 
    } else if (score >= 100) {
        radius = 6;
        speed = 4 * speedMultiplier; 
    } else if (score >= 65) {
        radius = 10;
        speed = 3 * speedMultiplier; 
    } else if (score>=40){
        radius = 13;
        speed = 2 * speedMultiplier; 
    }

    if (grayBalls.length < 2 && score >= 40) {
        grayBalls.push({
            x: Math.random() * canvas.width,
            y: 0,
            radius: radius,
            dy: speed + Math.random() * 1.5, 
        });
    }
}

setInterval(spawnGrayBalls, 700);

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
                ball.y = canvas.height / 2;
                ball.dy = -initialSpeed;
            }
        }
    });

    if (greenBall) {
        greenBall.y += greenBall.dy;
        if (greenBall.y > canvas.height - paddle.height && greenBall.x > paddle.x && greenBall.x < paddle.x + paddle.width) {
            greenBall.dy = -5;
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

    if (blueBall) {
        blueBall.y += blueBall.dy;
        if (blueBall.y > canvas.height - paddle.height && blueBall.x > paddle.x && blueBall.x < paddle.x + paddle.width) {
            blueBall = null;
            lives += 2;
            if (Math.random() < 0.2) lives += 1;
            setTimeout(() => { greenBall = null; }, 500);
        } else if (blueBall.y > canvas.height) {
            blueBall = null;
        }
    }

    if (score === 10 && !paddleResized) {
        balls.push({ x: canvas.width / 2, y: canvas.height / 2, radius: 10, dx: getRandomSpeed(), dy: getRandomSpeed() });
        if (paddle.width + 100 <= canvas.width) paddle.width += 100;
        paddleResized = true;
    }

    grayBalls.forEach((grayBall, index) => {
        grayBall.y += grayBall.dy;
        if (grayBall.y > canvas.height - paddle.height && grayBall.x > paddle.x && grayBall.x < paddle.x + paddle.width) {
            
            score += 1;
            setTimeout(() => {}, 500);
            grayBalls.splice(index, 1);
        }
        if (grayBall.y > canvas.height) {
            lives-=1
            grayBalls.splice(index, 1);
        }
        if (lives<=0){
            gameRunning = false;
                confirm(`Loss. Your score: ${score}`);
                document.location.reload();
        }
    });

    if (blackBall) {
        if (!blackBall.caught) {
            blackBall.y += blackBall.dy;
        }

        if (!isAnimating && blackBall.y > canvas.height - paddle.height &&
            blackBall.x > paddle.x && blackBall.x < paddle.x + paddle.width) {
            blackBall.caught = true;
            blackBall.dy = 0; 
            blackBall.y = canvas.height - paddle.height - blackBall.radius; 
            animateBlackBall();
        }

        if (blackBall.y > canvas.height) {
            if (!blackBall.caught) {
                score += 1;
                blackBall = null;
            }}}

    if (rightPressed && paddle.x < canvas.width - paddle.width) paddle.x += 7;
    if (leftPressed && paddle.x > 0) paddle.x -= 7;
}

function draw() {
    if (!gameRunning) return;
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    balls.forEach((ball) => drawCircle(ball.x, ball.y, ball.radius, 'blue'));
    if (greenBall) drawCircle(greenBall.x, greenBall.y, greenBall.radius, 'green');
    if (blueBall) drawCircle(blueBall.x, blueBall.y, blueBall.radius, 'lightblue');
    grayBalls.forEach((grayBall) => {
    c.beginPath();
    c.arc(grayBall.x, grayBall.y, grayBall.radius, 0, Math.PI * 2);
    c.fillStyle = 'gray';
    c.fill();
    });
    if (blackBall) {
        drawCircle(blackBall.x, blackBall.y, blackBall.radius, blackBall.color || "rgba(47, 45, 45, 0.86)");
    }
    drawText(`Score: ${score}`, 10, 20);
    drawText(`Lives: ${lives}`, canvas.width - 100, 20);
    update();
    requestAnimationFrame(draw);
}
draw();