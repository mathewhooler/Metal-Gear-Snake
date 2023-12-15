const audio = document.getElementById('audioPlayer');
const playButton = document.getElementById('playButton');
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoretext = document.querySelector("#scoreText");
const playAgainBtn = document.querySelector('#play-again-btn');
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = 'olivedrab';
const snakeColor = "darkgreen";
const snakeBorder = "black";
const rationColor = "brown";
const unitSize = 25;
const countdownEl = document.querySelector("#countdown");
const rationSound = document.getElementById("ration_sound");
const losingSound = document.getElementById("losing_sound");
const winningSound = document.getElementById("winning_sound");
const backgroundSound = document.getElementById("audioPlayer");
const countdownTimer = document.getElementById("countdownTimer")

let running = false;
let xVelocity = unitSize;
let yVelocity = unitSize;
let rationX;
let rationY;
let speed = 75;
let score = 0;
let winner = false;
let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
];

window.addEventListener('keydown', changeDirection);
playAgainBtn.addEventListener("click", playAgain);

function gameStart() {
    running = true;
    scoreText.textContent = score;
    createRation();
    drawRation();
    nextTick();
};
function nextTick() {
    if (running) {
        playAgainBtn.style.visibility = "hidden";
        setTimeout(() => {
            clearBoard();
            drawRation();
            moveSnake();
            drawSnake();
            playBackgroundMusic();
            checkGameOver();
            if (running) {
                checkGameWinner();
            }
            nextTick();
        },speed);
    }
    else {
        if (winner) {
            displayGameWinner();
        } else { displayGameOver(); }
        playAgainBtn.style.visibility = "visible";
        playAgainBtn.innerText = "Play Again";
    };
}
function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight)
};
function createRation() {
    function randomRation(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    rationX = randomRation(0, gameWidth - unitSize);
    rationY = randomRation(0, gameWidth - unitSize);
};
function drawRation() {
    ctx.fillStyle = rationColor;
    ctx.fillRect(rationX, rationY, unitSize, unitSize);
};
function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };

    snake.unshift(head);
    if (snake[0].x == rationX && snake[0].y == rationY) {
        score += 1;
        speed -= 5;
        scoreText.textContent = score;
        createRation();
        playRationSound();
    }
    else {
        snake.pop();
    }

};
function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);

    })
};
function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch (true) {
        case (keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case (keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case (keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;

    }

};
function checkGameWinner() {
    if (score >= 10) {
        running = false;
        winner = true;
    }
}
function displayGameWinner() {
    ctx.font = "60px Metal Gear";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("WinneR", gameWidth / 2, gameHeight / 2);
    running = false;
    winner = false;
    stopBackgroundMusic();
    playWinningSound();
}

function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y)
            running = false;
    }

};
function displayGameOver() {
    ctx.font = "60px Metal Gear";
    ctx.fillStyle = "darkred";
    ctx.textAlign = "center";
    ctx.fillText("Game oveR", gameWidth / 2, gameHeight / 2)
    running = false;
    playLosingSound();
    stopBackgroundMusic();
};
function playAgain(event) {
    score = 0;
    speed = 75;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 },
    ];
    renderCountdownTimer();
    playCountdownTimer();
    clearBoard();
};
function playBackgroundMusic() {
    backgroundSound.play();
}
function playRationSound() {
    rationSound.currentTime = 0;
    rationSound.play();
}

function playLosingSound() {
    losingSound.play();
}

function playWinningSound() {
    winningSound.currentTime = 0;
    winningSound.play();
}

function stopBackgroundMusic() {
    var backgroundAudio = document.getElementById("audioPlayer");
    backgroundAudio.pause();
}

function playCountdownTimer(){
    countdownTimer.currentTime = 0;
    countdownTimer.play();
    
}

function renderCountdownTimer() {
    let startingTimeValue = 3;
    
    
    countdownEl.style.visibility = 'visible'
    countdownEl.innerText = startingTimeValue
    
    const timerId = setInterval(() => {
        startingTimeValue--;
        if (startingTimeValue === 0) {
            countdownEl.style.visibility = 'hidden';
            clearInterval(timerId)
            gameStart();
            
        } else {
            countdownEl.innerText = startingTimeValue
        }
    }, 1000);
}