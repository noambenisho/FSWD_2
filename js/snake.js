// Game settings
const gridSize = 15; 
const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');

// Game variables
let direction = { x: 1, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let gameInterval;
let difficulty = {easy: 300, medium: 200, hard: 100}

// Create the grid dynamically
function createGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = j;
            cell.dataset.y = i;
            grid.appendChild(cell);
        }
    }
}

// Draw the snake
function drawSnake() {
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('snake'));
    snake.forEach(segment => {
        const cell = document.querySelector(`.cell[data-x="${segment.x}"][data-y="${segment.y}"]`);
        if (cell) cell.classList.add('snake');
    });
}

// Draw the food
function drawFood() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('food');
        cell.style.backgroundColor = '';
        });

    const foodCell = document.querySelector(`.cell[data-x="${food.x}"][data-y="${food.y}"]`);
    if (foodCell) {
        foodCell.classList.add('food');
        foodCell.style.backgroundColor = getRandomColor();
    }
}

function getRandomColor() {
    const minColor = '#B9B9B9';
    const maxColor = '#FFFFFF';

    let color;
    do {
        const letters = '0123456789ABCDEF';
        color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
    } while (parseInt(color.substring(1), 16) < parseInt(minColor.substring(1), 16) || parseInt(color.substring(1), 16) > parseInt(maxColor.substring(1), 16));

    return color;
}


// Update the snake's position
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Collision detection
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || 
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        placeFood();
    } else {
        snake.pop();
    }

    drawSnake();
}

// Place food at a random position
function placeFood() {
    food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
    };

    // Ensure food is not placed on the snake
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        placeFood();
    } else {
        drawFood();
    }
}

// Change direction based on arrow keys
function changeDirection(event) {
    const key = event.key;
    if (key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
    else if (key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
    else if (key === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
    else if (key === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
}

// End the game
function gameOver() {
    showGameOver();
    clearInterval(gameInterval);
}

function showGameOver() {
    // Check if a game over message already exists
    if (document.querySelector(".game-over")) {
        return; // If it exists, do nothing
    }

    // Create the game over message container
    const gameOverMessage = document.createElement("div");
    gameOverMessage.classList.add("game-over");

    // Create the text message
    const message = document.createElement("div");
    message.classList.add("game-over-message");
    message.textContent = "You lost! Click Restart to try again.";
    
    // Create the restart button
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.addEventListener("click", () => {
        restartGame();
        gameOverMessage.remove();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            restartGame();
            gameOverMessage.remove();
        }
        });

    // Append the message and button to the game over container
    gameOverMessage.appendChild(message);
    gameOverMessage.appendChild(restartButton);

    // Add the game over container to the body
    document.body.appendChild(gameOverMessage);	

    // Update the high scores
    updateHighScores(score);
    
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        updateUserHighScores(currentUser, score); // שמור את הציון של המשתמש הנוכחי
    }

    // Display the high scores
    displayHighScores();
}

// Restart the game
function restartGame() {
    updateScoreDisplay();

    if (gameInterval) {
        clearInterval(gameInterval);
    }

    snake = [
        { x: 7, y: 7 },
        { x: 6, y: 7 },
        { x: 5, y: 7 }
    ];
    direction = { x: 1, y: 0 };
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    placeFood();
    drawSnake();
    let level = document.querySelector('select').value
    gameInterval = setInterval(moveSnake, difficulty[level]);
}

// Event listeners
document.addEventListener('keydown', changeDirection);

let isGameRunning = false;

function startGame() {
    if (!isGameRunning) {
        isGameRunning = true; 
        restartGame(); 
    }
}

const startButton = document.getElementById("start-game");
startButton.addEventListener("click", startGame);

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        startGame();
    }
});

// Initialize the game
createGrid();
displayHighScores();

// update the snake high scores for main page
function updateUserHighScores(username, score) {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    if (!userData[username]) {
        console.error("User not found in userData.");
        return;
    }

    if (!userData[username].snakeHighScores) {
        userData[username].snakeHighScores = [];
    }

    userData[username].snakeHighScores.push(score);

    localStorage.setItem("userData", JSON.stringify(userData));
}

// Display the user's high scores in the main page
function displayUserHighScores(username) {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    const highScores = userData[username]?.snakeHighScores || [];
    const highScoresElement = document.getElementById("high-scores");

    if (highScoresElement) {
        highScoresElement.innerHTML = highScores
            .sort((a, b) => b - a) // Sort the scores in descending order
            .map((score, index) => `<li>${index + 1}. ${score}</li>`)
            .join("");
    }
}

// Function to update the score display
function updateScoreDisplay() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Score: ${score}`;
}

function saveHighScore(score, difficulty) {
    const scoresKey = `${difficulty}-highScores`;
    const scores = JSON.parse(localStorage.getItem(scoresKey)) || [];
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        console.error("No current user found!");
        return;
    }

    scores.push({ score, username: currentUser });

    const sortedScores = scores.sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem(scoresKey, JSON.stringify(sortedScores));
}


function loadHighScores(difficulty) {
    const scoresKey = `${difficulty}-highScores`;
    return JSON.parse(localStorage.getItem(scoresKey)) || [];
}

function displayHighScores() {
    const difficulty = document.getElementById("difficulty-level").value;
    const tables = document.querySelectorAll(".high-scores-table");
    const titels = document.querySelectorAll('h2');

    tables.forEach(table => table.style.display = "none");
    titels.forEach(t => t.style.display = "none");

    const tableId = `${difficulty}-high-scores`;
    const highScoresTable = document.getElementById(tableId);
    const difficulty_title = document.getElementById(`${difficulty}-h2`);
    if (highScoresTable && difficulty_title) {
        highScoresTable.style.display = "table";
        difficulty_title.style.display = "block";
        const highScoresTableBody = highScoresTable.querySelector("tbody");

        const highScores = loadHighScores(difficulty);
        highScoresTableBody.innerHTML = highScores
            .map((entry, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${entry.score}</td>
                    <td>${entry.username}</td>
                </tr>
            `)
            .join("");
    } else {
        console.error(`Table with ID ${tableId} not found.`);
    }
}

function updateHighScores(score) {
    const difficulty = document.getElementById("difficulty-level").value;
    saveHighScore(score, difficulty);
    displayHighScores();
}

document.getElementById("difficulty-level").addEventListener("change", displayHighScores);

// Phone support 
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// this event is triggered when the user touches the screen
document.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

// this event is triggered when the user stops touching the screen
document.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // check if the swipe is horizontal or vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // horizontal swipe
        if (deltaX > 0 && direction.x === 0) {
            direction = { x: 1, y: 0 }; 
        } else if (deltaX < 0 && direction.x === 0) {
            direction = { x: -1, y: 0 }; 
        }
    } else {
        // vertical swipe
        if (deltaY > 0 && direction.y === 0) {
            direction = { x: 0, y: 1 }; 
        } else if (deltaY < 0 && direction.y === 0) {
            direction = { x: 0, y: -1 }; 
        }
    }
}