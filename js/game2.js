// Select DOM elements
const gridElement = document.getElementById("grid");
const restartButton = document.getElementById("restart");

// Add a random tile (2 or 4)
function addRandomTile() {
    if (!grid || grid.length !== 4) {
        console.error("Grid is not initialized properly");
        return;
    }

    let emptyTiles = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] === 0) {
                emptyTiles.push({ row, col });
            }
        }
    }

    if (emptyTiles.length > 0) {
        let { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}


// Create the grid tiles dynamically in the DOM
function createGrid() {
    gridElement.innerHTML = ""; 
    for (let i = 0; i < 16; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        gridElement.appendChild(tile);
    }
}

// Update the DOM to reflect the grid
function updateGrid() {
    const tiles = document.querySelectorAll(".tile");
    let index = 0;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const value = grid[row][col];
            tiles[index].textContent = value === 0 ? "" : value;
            tiles[index].dataset.value = value;
            tiles[index].className = `tile tile-${value}`; // Update class for styling
            index++;
        }
    }
}

// Initialize the game
function initializeGame() {
    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    createGrid(); // Create the grid visualization on load
    addRandomTile();
    addRandomTile(); // add the initial 2 tiles
    updateGrid();
}

// Restart button functionality
restartButton.addEventListener("click", initializeGame);

// Key press event listener for movement
document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        const moved = moveTiles(key); // Perform the move
        if (moved) {
            addRandomTile(); // Add a new random tile only if something moved
            updateGrid(); // Update the display
        }
    }
}); 

// Move tiles in a specified direction
function moveTiles(direction) {
    let moved = false;

    // Helper to move a row/column in the grid
    function slide(row) {
        let newRow = row.filter(val => val !== 0); // Remove zeros
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) { // Merge tiles
                newRow[i] *= 2;
                newRow[i + 1] = 0; // Set the next tile to 0 after merging
                moved = true;
            }
        }
        newRow = newRow.filter(val => val !== 0); // Remove zeros again
        while (newRow.length < 4) newRow.push(0); // Add zeros to the end
        return newRow;
    }

    // Move grid based on direction
    if (direction === "ArrowLeft") {
        for (let row = 0; row < 4; row++) {
            let newRow = slide(grid[row]);
            if (grid[row].toString() !== newRow.toString()) moved = true;
            grid[row] = newRow;
        }
    } else if (direction === "ArrowRight") {
        for (let row = 0; row < 4; row++) {
            let newRow = slide(grid[row].slice().reverse()).reverse();
            if (grid[row].toString() !== newRow.toString()) moved = true;
            grid[row] = newRow;
        }
    } else if (direction === "ArrowUp") {
        for (let col = 0; col < 4; col++) {
            let column = grid.map(row => row[col]);
            let newColumn = slide(column);
            for (let row = 0; row < 4; row++) {
                if (grid[row][col] !== newColumn[row]) moved = true;
                grid[row][col] = newColumn[row];
            }
        }
    } else if (direction === "ArrowDown") {
        for (let col = 0; col < 4; col++) {
            let column = grid.map(row => row[col]).reverse();
            let newColumn = slide(column).reverse();
            for (let row = 0; row < 4; row++) {
                if (grid[row][col] !== newColumn[row]) moved = true;
                grid[row][col] = newColumn[row];
            }
        }
    }

    return moved;
}

document.addEventListener("DOMContentLoaded", () => {
    // Start the game on load
    initializeGame();
});
