// Initialize the grid
let grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

// Select DOM elements
const gridElement = document.getElementById("grid");
const restartButton = document.getElementById("restart");

// Add a random tile (2 or 4)
function addRandomTile() {
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

// Update the DOM to reflect the grid
function updateGrid() {
    const tiles = document.querySelectorAll(".tile");
    let index = 0;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const value = grid[row][col];
            tiles[index].textContent = value === 0 ? "" : value;
            tiles[index].dataset.value = value;
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
        [0, 0, 0, 0],
    ];
    addRandomTile();
    addRandomTile();
    updateGrid();
}

// Restart button functionality
restartButton.addEventListener("click", initializeGame);

// Key press event listener for movement
document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        // Movement logic will be implemented here
        console.log(`Key pressed: ${key}`);
        updateGrid(); // Temporary: Just update the grid
    }
});

// Start the game on load
initializeGame();