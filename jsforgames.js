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
let level = 1;
let redbl=false;
let grabl=false;
let grebl=false;
let liblubl=false;
let fastYellowBalls = [];
let playerGun = null;
let promo = ""; 



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

function chooseGameMode() {
    let choice = prompt("Select game mode: 1 - Free, 2 - Story, 3 - Control.");
    if (choice === '1') {
        freemod()
    } else if (choice === '2') {
        storymod();
    } 
    else if (choice === '3'){
        alert("Use your mouse (finger) or A/D keys to control. Press the U (in match) key to open the field for entering codes.")
        chooseGameMode();
    }
    else {
        alert("Wrong choice. Try again.");
        chooseGameMode();
    }
}

chooseGameMode();

function freemod(){
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
        radius = 5;
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

function spawnFastYellowBall() {
    if (score >= 80 && Math.random() < 0.2) {
        fastYellowBalls.push({
            x: Math.random() * canvas.width,
            y: 0,
            radius: 10,
            dy: 15 * speedMultiplier
        });
    }
}

setInterval(spawnFastYellowBall, 500);

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

    fastYellowBalls.forEach((ball, index) => {
        ball.y += ball.dy;
        if (ball.y > canvas.height - paddle.height && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            lives -= 2;
            fastYellowBalls.splice(index, 1);
        } else if (ball.y > canvas.height) {
            fastYellowBalls.splice(index, 1);
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

    if (score === 7 && !paddleResized) {
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
draw();}
function storymod(){
    function drawRect(x, y, w, h) { c.fillStyle = 'white'; c.fillRect(x, y, w, h); }
    function drawCircle(x, y, r, color) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = color; c.fill(); }
    function drawText(text, x, y) { c.fillStyle = 'white'; c.font = '20px Cursive'; c.fillText(text, x, y); }
    
    function getRandomSpeed() {
        const speed = (Math.random() * (maxSpeed - initialSpeed) + initialSpeed) * speedMultiplier;
        return Math.random() > 0.5 ? speed : -speed;
    }

    document.addEventListener('keydown', (e) => {
        if (['u', 'г'].includes(e.key)){
            let lvlPromo = prompt("Enter code");    
            if (lvlPromo === "WWqqoohGsdhrykkjdhl1") {
                level=2;
                lives=3;
                score=0;
            } 
            else if (lvlPromo === "orrawJegahforyellow2") {
                level=3;
                lives=3;
                score=0;
            }
            else if (lvlPromo === "fooortuNERfourofthreeOK3") {
                level=4;
                lives=3;
                score=0;
            }
            else if (lvlPromo === "444ytrioromaposhalkahalolLLLidite") {
                level=5;
                lives=3;
                score=0;
            }   
            else if (lvlPromo === "bossfight6lvlyellowballQQwwuuiifhhdsbj") {
                level=6;
                lives=3;
                score=0;
            }
        }
    });

    function showBall() {
        let ball = document.createElement("div");
        ball.id = "yellowBall";
        ball.style.width = "50px";
        ball.style.height = "50px";
        ball.style.backgroundColor = "yellow";
        ball.style.borderRadius = "50%";
        ball.style.position = "absolute";
        ball.style.top = "450px";
        ball.style.left = "50%";
        document.body.appendChild(ball);
    }
    
    function hideBall() {
        let ball = document.getElementById("yellowBall");
        if (ball) {
            ball.remove();
        }
    }
    
    function spawnGreenBall() {
        if (score >= 25 && Math.random() < 0.5 && !greenBall && level >= 3) {
            greenBall = {
                x: Math.random() * canvas.width,
                y: 0,
                radius: 10,
                dy: (Math.random() * 4 + 6) * speedMultiplier
            };
        }
    }
    setInterval(spawnGreenBall, 3000);
    
    function spawnBlueBall() {
        if (score >= 35 && Math.random() < 0.03 && !blueBall && level>=4) {
            blueBall = { x: Math.random() * canvas.width, y: 0, radius: 12, dy: 10 * speedMultiplier };
        }
    }
    setInterval(spawnBlueBall, 1000);
    
    function spawnBlackBall() {
        if (level>=5){
        const chance = score >= 100 ? 0.65 : score >= 50 ? 0.45 : 0; 
        if (Math.random() < chance && !blackBall) {
            blackBall = { 
                x: Math.random() * canvas.width, 
                y: 0, 
                radius: 14, 
                dy: 3 * speedMultiplier, 
                caught: false 
            };
        }}
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
        let radius = 13;
        let speed = 2 * speedMultiplier;
    
    
        if (level===5) {
            radius = 4;
            speed = 7 * speedMultiplier; 
        }
        else{
            radius = 13;
            speed = 2 * speedMultiplier;
        }        
    
        if (grayBalls.length < 2 && score >= 40 && level>1 && level<6) {
            grayBalls.push({
                x: Math.random() * canvas.width,
                y: 0,
                radius: radius,
                dy: speed + Math.random() * 1.5, 
            });
        }
    }
    
    setInterval(spawnGrayBalls, 700);


    function spawnFastYellowBall() {
        if (score >= 50 && level >= 6 && Math.random() < 0.2) {
            fastYellowBalls.push({
                x: Math.random() * canvas.width,
                y: 0,
                radius: 10,
                dy: 15 * speedMultiplier
            });
        }
    }
    setInterval(spawnFastYellowBall, 500);

    function spawnPlayerGun() {
        if (score >= 60 && level >= 6 && !playerGun) {
            playerGun = { x: paddle.x + paddle.width / 2, bullets: [] };
            playerGun.interval = setInterval(() => {
                playerGun.bullets.push({ x: playerGun.x, y: canvas.height - paddle.height, dy: -8 });
            }, 200);
        }
    }
    
    function update() {
        if (!gameRunning) return;
    
        spawnPlayerGun();
    
        fastYellowBalls.forEach((ball, index) => {
            ball.y += ball.dy;
            if (ball.y > canvas.height - paddle.height && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                lives -= 2;
                fastYellowBalls.splice(index, 1);
            } else if (ball.y > canvas.height) {
                fastYellowBalls.splice(index, 1);
            }
        });
    
        if (lives <= 0) {
            gameRunning = false;
            alert(`Loss. Your score: ${score}. Level: ${level}.`);
            document.location.reload();
            return;
        }
    
        if (playerGun) {
            playerGun.x = paddle.x + paddle.width / 2;
    
            for (let i = playerGun.bullets.length - 1; i >= 0; i--) {
                let bullet = playerGun.bullets[i];
                bullet.y += bullet.dy;
    
                
                for (let j = fastYellowBalls.length - 1; j >= 0; j--) {
                    let ball = fastYellowBalls[j];
                    if (Math.abs(bullet.x - ball.x) < ball.radius && Math.abs(bullet.y - ball.y) < ball.radius) {
                        fastYellowBalls.splice(j, 1);
                        playerGun.bullets.splice(i, 1);
                        score+=1;
                        break;
                    }
                }
    
                
                if (greenBall) {
                    let ball2 = greenBall;
                    if (Math.abs(bullet.x - ball2.x) < ball2.radius && Math.abs(bullet.y - ball2.y) < ball2.radius) {
                        greenBall = null;  
                        playerGun.bullets.splice(i, 1);
                        score+=1;
                        if (Math.random() < 0.2) lives++;
                        break;
                    }
                }
                if (blackBall) {
                    let ball3 = blackBall;
                    if (Math.abs(bullet.x - ball3.x) < ball3.radius && Math.abs(bullet.y - ball3.y) < ball3.radius) {
                        blackBall = null;  
                        playerGun.bullets.splice(i, 1);
                        score+=1;
                        break;
                    }
                }
            }
        }
    
        balls.forEach((ball) => {
            ball.x += ball.dx;
            ball.y += ball.dy;
            if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) ball.dx *= -1;
            if (ball.y < ball.radius) ball.dy *= -1;
            if (ball.y > canvas.height - paddle.height && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                ball.dy *= -1;
                score++;
            }
            if (ball.y > canvas.height) {
                lives--;
                if (lives === 0) {
                    gameRunning = false;
                    alert(`Loss. Your score: ${score}. Level: ${level}.`);
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
                score++;
                if (Math.random() < 0.2) lives++;
                setTimeout(() => { greenBall = null; }, 500);
            } else if (greenBall.y > canvas.height) {
                lives--;
                greenBall = null;
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
        if (score >= 8 && !redbl) {
            redbl = true;
        }
        
        if (redbl && !paddleResized) {
            balls.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                radius: 10,
                dx: getRandomSpeed(),
                dy: getRandomSpeed()
            });
            
            if (paddle.width + 100 <= canvas.width) {
                paddle.width += 100;
            }
            
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
                    alert(`Loss. Your score: ${score}. Level: ${level}.`);
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
                }}
    
        if (rightPressed && paddle.x < canvas.width - paddle.width) paddle.x += 7;
        if (leftPressed && paddle.x > 0) paddle.x -= 7;
        
        if (score >= 60 && level === 1) { 
            score = 0;
            level = 2;
            lives = 3;
            alert(`You have moved to level 2! Code for this level: WWqqoohGsdhrykkjdhl1`);
            showBall(); 
        
            setTimeout(() => {
                alert("Yellow ball: Did you come here?...");
                score = 0;
                lives = 3;
                setTimeout(() => {
                    alert("Yellow ball: But why?");
                    score = 0;
                    lives = 3;
                    setTimeout(() => {
                        alert("Yellow ball: No matter, you can't overthrow me.");
                        score = 0;
                        lives = 3;
                        setTimeout(() => {
                            hideBall(); 
                            alert('*The yellow ball has disappeared*');
                            score = 0;
                            lives = 3;
                            blackBall=null;
                            greenBall=null;
                            blueBall=null;
                            grayBalls=[];
                            level=2;
                        }, 0); 
        
                    }, 200);
        
                }, 200); 
        
            }, 500); 
            lives = 3;
        }
        
        
        if (score >= 100 && level === 2) {
            score = 0;
            level = 3;
            lives = 3;
            alert(`You have moved to level 3! Code for this level: orrawJegahforyellow2`);
            showBall(); 
        
            setTimeout(() => {
                alert("Yellow ball: Are you trying to get past this?...");
                score = 0;
                lives = 3;
                setTimeout(() => {
                    alert("Yellow ball: But why?");
                    score = 0;
                    lives = 3;
                    setTimeout(() => {
                        alert("Yellow ball: You won't get what you want anyway.");
                        score = 0;
                        lives = 3;
                        setTimeout(() => {
                            alert('Yellow ball: General cucumber?');
                            score = 0;
                            lives = 3;
                            setTimeout (()=>{
                                alert('General Cucumber: Am I listening?');
                                score = 0;
                                lives = 3;
                                setTimeout (()=>{
                                    alert('Yellow ball: Destroy it!');
                                    score = 0;
                                    lives = 3;
                                    setTimeout (()=>{
                                        hideBall();
                                        alert('*The yellow ball has disappeared*');
                                        score = 0;
                                        lives = 3;
                                        blackBall=null;
                                        greenBall=null;
                                        blueBall=null;
                                        grayBalls=[];
                                        level=3;
                                    }, 0);
                                }, 200);
                            }, 200);
                        }, 200); 
        
                    }, 200);
        
                }, 200); 
        
            }, 500); 
            lives = 3;
        }
    
        if (score >= 150 && level === 3) {
            score = 0;
            level = 4;
            lives = 3;
            alert(`You have moved to level 4! Code for this level: fooortuNERfourofthreeOK3`);
            showBall(); 
            setTimeout(() => {
                alert("Yellow ball: Cucumber... You failed...");
                score = 0;
                lives = 3;
                setTimeout(() => {
                    alert("General Cucumber: Sorry sir, but I can't do it alone...");
                    score = 0;
                    lives = 3;
                    setTimeout(() => {
                        alert("Yellow ball: Okay... Mr. Blue Ice, will you help our cucumber?");
                        score = 0;
                        lives = 3;
                        setTimeout(() => {
                            alert('Mr. Blue Ice: What? Kill an innocent player? No. I condemn you.');
                            score = 0;
                            lives = 3;
                            setTimeout (()=>{
                                alert('Yellow ball: Blue Ice again for his part. I need to find Boom-Buga, you will need to restrain the player until then.');
                                score = 0;
                                lives = 3;
                                setTimeout (()=>{
                                    alert('General Cucumber: Exactly! Boring Gray and I can detain him!');
                                    score = 0;
                                    lives = 3;
                                    setTimeout (()=>{
                                        hideBall();
                                        alert('*The yellow ball has disappeared*');
                                        score = 0;
                                        lives = 3;
                                        blackBall=null;
                                        greenBall=null;
                                        blueBall=null;
                                        grayBalls=[];
                                        level=4;
                                    }, 0);
                                }, 200);
                            }, 200);
                        }, 200); 
        
                    }, 200);
        
                }, 200); 
        
            }, 500); 
            lives = 3;
        }
        
        if (score >= 155 && level === 4) {
            score = 0;
            level = 5;
            lives = 3;
            alert(`You have moved to level 5! Code for this level: 444ytrioromaposhalkahalolLLLidite`);
            showBall(); 
            setTimeout(() => {
                alert("Yellow ball: Great! I found Boom Buga!");
                score = 0;
                lives = 3;
                setTimeout(() => {
                    alert("General Cucumber: We almost lost! We will need it!");
                    score = 0;
                    lives = 3;
                    setTimeout(() => {
                        alert("Boom-Booga: Boom Boom...");
                        score = 0;
                        lives = 3;
                        setTimeout(() => {
                            alert('Yellow ball: The only negative is that he... He does not speak well...');
                            score = 0;
                            lives = 3;
                            setTimeout (()=>{
                                alert("Yellow ball: Let's tear him to pieces!");
                                score = 0;
                                lives = 3;
                                setTimeout (()=>{
                                    hideBall();
                                    alert('*The yellow ball has disappeared*');
                                    score = 0;
                                    lives = 3;
                                    blackBall=null;
                                    greenBall=null;
                                    blueBall=null;
                                    grayBalls=[];
                                    level=5;
                                }, 0);
                            }, 200);
                        }, 200); 
        
                    }, 200);
        
                }, 200); 
        
            }, 500); 
            lives = 3;
        }
        
        if (score >= 200 && level === 5) {
            score = 0;
            lives = 3;
            alert(`You have moved to level 6! Code for this level: bossfight6lvlyellowballQQwwuuiifhhdsbj`);
            showBall(); 
        
            setTimeout(() => {
                alert("Yellow ball: Well, you've finished the game..");
                score = 0;
                lives = 3;
                setTimeout(() => {
                    alert("General Cucumber: Sir, Boring Grey was killed...");
                    score = 0;
                    lives = 3;
                    setTimeout(() => {
                        alert("Yellow ball: I don't understand why you brought it to this...");
                        score = 0;
                        lives = 3;
                        setTimeout(() => {
                            alert('Yellow ball: Wait for me here))');
                            score = 0;
                            lives = 3;
                            setTimeout (()=>{
                                hideBall();
                                alert('*The yellow ball has disappeared*')
                                score = 0;
                                lives = 3;
                                
                                blackBall=null;
                                greenBall=null;
                                blueBall=null;
                                grayBalls=[];
                                level = 6;
                            }, 0);
                        }, 200); 
        
                    }, 200);
        
                }, 200); 
        
                }, 500); 
            lives = 3;
            }
        if (score >= 200 && level === 6) {
            gameRunning = false;
            alert(`You won!`);
            showBall(); 
        
            setTimeout(() => {
                alert("Yellow ball: For now, victory is yours...");
                setTimeout(() => {
                    alert("Yellow Ball: When General Cucumber gets his upgrade, you'll be in for a treat...");
                    setTimeout(() => {
                        alert("Yellow ball: I'm watching you...");
                        setTimeout(() => {
                            alert('Yellow ball: Get out of my place...');
                            setTimeout (()=>{
                                hideBall();
                                alert('*The yellow ball has disappeared*')
                                blackBall=null;
                                greenBall=null;
                                blueBall=null;
                                grayBalls=[];
                            }, 0);
                        }, 200); 
        
                    }, 200);
        
                }, 200); 
        
                }, 500); 
            }
        }}
    
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
        fastYellowBalls.forEach((ball) => drawCircle(ball.x, ball.y, ball.radius, 'yellow'));
        if (playerGun) {
            playerGun.bullets.forEach((bullet) => drawCircle(bullet.x, bullet.y, 5, 'red'));
        }
        drawText(`Score: ${score}`, 10, 20);
        drawText(`Lives: ${lives}`, canvas.width - 100, 20);
        update();
        requestAnimationFrame(draw);
    }
    draw();}
