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
    // Generate a random color in hex format
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
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

// Initialize the game
createGrid();
displayHighScores();
restartGame();


// עדכון שיאי Snake עבור המשתמש הנוכחי
function updateUserHighScores(username, score) {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    // ודא שמשתמש קיים
    if (!userData[username]) {
        console.error("User not found in userData.");
        return;
    }

    // אם אין עדיין שיאים, צור מערך חדש
    if (!userData[username].snakeHighScores) {
        userData[username].snakeHighScores = [];
    }

    // הוסף את הציון הנוכחי
    userData[username].snakeHighScores.push(score);

    // שמור את השיאים המעודכנים
    localStorage.setItem("userData", JSON.stringify(userData));
}

// הצגת שיאי Snake עבור המשתמש הנוכחי
function displayUserHighScores(username) {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    // בדוק אם למשתמש יש שיאים
    const highScores = userData[username]?.snakeHighScores || [];
    const highScoresElement = document.getElementById("high-scores");

    // הצג את השיאים בדף
    if (highScoresElement) {
        highScoresElement.innerHTML = highScores
            .sort((a, b) => b - a) // מיון מהגבוה לנמוך
            .map((score, index) => `<li>${index + 1}. ${score}</li>`)
            .join("");
    }
}



// Function to update the score display
function updateScoreDisplay() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Score: ${score}`;
}

// Load high scores from localStorage
function loadHighScores() {
    const scores = JSON.parse(localStorage.getItem("snakeHighScores")) || [];
    return scores;
}

// Update high scores with the current score
function updateHighScores(score) {
    let highScores = loadHighScores();

    // Add the current score to the high scores list
    highScores.push(score);

    // Sort the scores in descending order
    highScores.sort((a, b) => b - a);

    // Keep only the top 10 scores
    highScores = highScores.slice(0, 10);

    // Save the updated high scores
    saveHighScores(highScores);
}

// Save high scores to localStorage
function saveHighScores(scores) {
    localStorage.setItem("snakeHighScores", JSON.stringify(scores));
}

// Display the high scores on the screen
function displayHighScores() {
    const highScores = loadHighScores();
    const highScoresTableBody = document.getElementById("snake-high-scores");

    // Clear existing rows
    highScoresTableBody.innerHTML = "";

    // Add each score as a row in the table
    highScores.forEach((score, index) => {
        const row = document.createElement("tr");

        const rankCell = document.createElement("td");
        rankCell.textContent = index + 1;

        const scoreCell = document.createElement("td");
        scoreCell.textContent = score;

        row.appendChild(rankCell);
        row.appendChild(scoreCell);
        highScoresTableBody.appendChild(row);
    });
}