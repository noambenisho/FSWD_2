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

    // Display the high scores
    displayHighScores();
}


// Function to update the score display
function updateScoreDisplay() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Score: ${score}`;
}

// Load high scores from localStorage
function loadHighScores() {
    if (document.title == 'Snake Game') {
        const scores = JSON.parse(localStorage.getItem("snakeHighScores")) || [];
    }else {
        const scores = JSON.parse(localStorage.getItem("2048HighScores")) || [];
    }
    
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
    if (document.title == 'Snake Game') {
        localStorage.setItem("snakeHighScores", JSON.stringify(scores));
    } else {
        localStorage.setItem("2048HighScores", JSON.stringify(scores));
    }
}

// Display the high scores on the screen
function displayHighScores() {
    const highScores = loadHighScores();
    if (document.title == 'Snake Game') {
        const highScoresTableBody = document.getElementById("snake-high-scores");
    } else {
        const highScoresTableBody = document.getElementById("2048-high-scores");
    }

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