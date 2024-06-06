
let canvas = document.getElementById('mazeCanvas');
let ctx = canvas.getContext('2d');
var canvasSize = 400;
var cellSize = 40;

var cols,rows;
var grid = [];
var walls = [];
var player = { x: 0, y: 0, path: [{x: 0, y: 0}] };
var SOLPATH = [];

// Directions for neighboring cells
const directions = [
    { x: 0, y: -1 }, // Up
    { x: 1, y: 0 },  // Right
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }  // Left
];

var startTime;
var endTime;
var gameWon = false;



class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visited = false;
        this.walls = [true, true, true, true]; // Top, Right, Bottom, Left
    }

    draw() {
        const x = this.x * cellSize;
        const y = this.y * cellSize;

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;

        // Draw walls
        if (this.walls[0]) ctx.strokeRect(x, y, cellSize, 0); // Top
        if (this.walls[1]) ctx.strokeRect(x + cellSize, y, 0, cellSize); // Right
        if (this.walls[2]) ctx.strokeRect(x, y + cellSize, cellSize, 0); // Bottom
        if (this.walls[3]) ctx.strokeRect(x, y, 0, cellSize); // Left
    }
}



// Prim's algorithm to generate the maze
function generateMaze() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    const startCell = grid[0][0];
    startCell.visited = true;
    addWalls(startCell);

    while (walls.length > 0) {
        const randomWallIndex = Math.floor(Math.random() * walls.length);
        const { cell, direction } = walls[randomWallIndex];
        const nextCell = getNeighbor(cell, direction);

        if (nextCell && !nextCell.visited) {
            nextCell.visited = true;
            removeWall(cell, nextCell, direction);
            addWalls(nextCell);
        }

        walls.splice(randomWallIndex, 1);
        drawMaze();
    }
    console.log(grid[0][0].walls);
    var lastOne = grid[grid.length-1][grid.length-1];
    lastOne.walls[1] = false;
    drawMaze();
    // .walls[1] = true;
}

function addWalls(cell) {
    for (let direction of directions) {
        const neighbor = getNeighbor(cell, direction);
        if (neighbor && !neighbor.visited) {
            walls.push({ cell, direction });
        }
    }
}

function getNeighbor(cell, direction) {
    const x = cell.x + direction.x;
    const y = cell.y + direction.y;
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
        return grid[y][x];
    }
    return null;
}

function removeWall(cell, nextCell, direction) {
    const dx = nextCell.x - cell.x;
    const dy = nextCell.y - cell.y;

    if (dx === 1) {
        cell.walls[1] = false;
        nextCell.walls[3] = false;
    } else if (dx === -1) {
        cell.walls[3] = false;
        nextCell.walls[1] = false;
    } else if (dy === 1) {
        cell.walls[2] = false;
        nextCell.walls[0] = false;
    } else if (dy === -1) {
        cell.walls[0] = false;
        nextCell.walls[2] = false;
    }
}

function drawMaze() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    for (let row of grid) {
        for (let cell of row) {
            cell.draw();
        }
    }
    drawPath();
    drawPlayer();
}

function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x * cellSize + 2, player.y * cellSize + 2, cellSize - 4, cellSize - 4);
}

function drawPath() {
    ctx.fillStyle = 'rgba(0, 255, 255, 0.2)'; // Semi-transparent green
    player.path.forEach(position => {
        ctx.fillRect(position.x * cellSize + 2, position.y * cellSize + 2, cellSize - 4, cellSize - 4);
    });
}

function updateArray(array, newDict, prevDict) {
    // Check if the dictionary exists in the array
    const index = array.findIndex(item => item.x === newDict.x && item.y === newDict.y);
    const oldIndex = array.findIndex(item => item.x === prevDict.x && item.y === prevDict.y)
    if (index !== -1) {
        // If it exists, remove it
        array.splice(oldIndex, 1);
    } else {
        // If it doesn't exist, add it
        array.push(newDict);
    }
}

function movePlayer(dx, dy) {
    if (gameWon) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
        const currentCell = grid[player.y][player.x];
        const nextCell = grid[newY][newX];

        if (
            (dx === 1 && !currentCell.walls[1]) ||
            (dx === -1 && !currentCell.walls[3]) ||
            (dy === 1 && !currentCell.walls[2]) ||
            (dy === -1 && !currentCell.walls[0])
        ) {
            // Animate player movement
            animatePlayerMove(player.x, player.y, newX, newY);
            updateArray(player.path, {x: newX, y: newY}, { x: player.x, y: player.y });
            player.x = newX;
            player.y = newY;
            checkWin();
        }
    }
}

function animateSolutionPath(path) {
    let index = 0;

    function animate() {
        if (index >= path.length) return; // End of path

        const cell = path[index];

        // Change the background color of the cell to gold
        ctx.fillStyle = 'gold';
        ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);

        // Redraw the cell borders to make sure they're visible
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        const currentCell = grid[cell.y][cell.x];
        if (currentCell.walls[0]) ctx.strokeRect(cell.x * cellSize, cell.y * cellSize, cellSize, 0); // Top
        if (currentCell.walls[1]) ctx.strokeRect(cell.x * cellSize + cellSize, cell.y * cellSize, 0, cellSize); // Right
        if (currentCell.walls[2]) ctx.strokeRect(cell.x * cellSize, cell.y * cellSize + cellSize, cellSize, 0); // Bottom
        if (currentCell.walls[3]) ctx.strokeRect(cell.x * cellSize, cell.y * cellSize, 0, cellSize); // Left

        index++;
        requestAnimationFrame(animate);
    }

    animate();
}

function animatePlayerMove(fromX, fromY, toX, toY) {
    const startTime = performance.now();
    const duration = 100; // Duration in milliseconds

    function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentX = fromX + (toX - fromX) * progress;
        const currentY = fromY + (toY - fromY) * progress;

        drawMaze();
        ctx.fillStyle = 'red';
        ctx.fillRect(currentX * cellSize + 2, currentY * cellSize + 2, cellSize - 4, cellSize - 4);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            drawMaze(); // Final drawing at the destination position
        }
    }

    requestAnimationFrame(animate);
}

function checkWin() {
    if (player.x === cols - 1 && player.y === rows - 1) {
        endTime = new Date();
        gameWon = true;
        stopCountdown();
        if (PLAYERLVL === 10)
        {
            $('.gameMessages').html("Congratulations<br> You've completed the game!");
            
            // Add coloring class based on the content of the message
            $('.gameMessages').addClass('gameWonMessage');
            $('.gameMessages').removeClass('levelWonMessage');
            $('.gameMessages').removeClass('timeUpMessage');

            $('.gameMessages').fadeIn("slow");

        }
        
        else
        {
            $('.gameMessages').html("Level <strong>" + PLAYERLVL + "</strong> Completed");
            
            // Add coloring class based on the content of the message
            $('.gameMessages').addClass('levelWonMessage');
            $('.gameMessages').removeClass('gameWonMessage');
            $('.gameMessages').removeClass('timeUpMessage');
            $('.gameMessages').fadeIn("slow");
            
            $('.mazeButtons .nextLevelButton').fadeIn('slow');
            // Update level number, and print it on the screen
            

        }
        // Modify the modal message
        
        // const timeTaken = (endTime - startTime) / 1000;
        // setTimeout(() => alert(`Congratulations! You reached the end in ${timeTaken} seconds.`), 100);
        
    }
}

// Adding the mobile touchscreen swipe
const hammer = new Hammer(canvas);
hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
hammer.on('swipeleft', function(event) {
    movePlayer(-1, 0);
});  
hammer.on('swiperight', function(event) {
    movePlayer(1, 0);
});

hammer.on('swipeup', function(event) {
    movePlayer(0, -1);
});
  

hammer.on('swipedown', function(event) {
    movePlayer(0, 1);
});
  
  
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
    }
});


function initGame(level=1){
    if (level != 1){
        canvasSize += 80;
    }
    cols = Math.floor(canvasSize / cellSize);
    rows = Math.floor(canvasSize / cellSize);
    // if (level != 1)
    // cellSize -= 2;
    
    canvas.width = canvasSize;
    canvas.height = canvasSize;


    startTime = null;
    endTime = null;
    gameWon = false;

    grid = [];
    walls = [];
    player = { x: 0, y: 0, path: [{x: 0, y: 0}] };
    
    // Initialize grid with cells
    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
            const cell = new Cell(x, y);
            row.push(cell);
        }
        grid.push(row);
    }
    
    startGame();
    
}

function startGame(){
    generateMaze();
    initCountdown();
    startTime = new Date();
}
// generateMaze();
// startTime = new Date();


// Function to solve the maze using DFS
// function solveMaze(grid) {
//     const start = { x: 0, y: 0 };
//     const end = { x: cols - 1, y: rows - 1 };
//     const stack = [start];
//     const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
//     const prev = Array.from({ length: rows }, () => Array(cols).fill(null));

//     visited[start.y][start.x] = true;

//     while (stack.length > 0) {
//         const { x, y } = stack.pop();

//         // If we reached the end, reconstruct the path
//         if (x === end.x && y === end.y) {
//             const path = [];
//             let current = end;
//             while (current) {
//                 path.push(current);
//                 current = prev[current.y][current.x];
//             }
//             path.reverse();
//             return path;
//         }

//         // Explore neighbors (right, down, left, up)
//         for (const direction of directions) {
//             const nextX = x + direction.x;
//             const nextY = y + direction.y;

//             if (nextX >= 0 && nextX < cols && nextY >= 0 && nextY < rows) {
//                 const currentCell = grid[y][x];
//                 const nextCell = grid[nextY][nextX];

//                 // Check if there's no wall between currentCell and nextCell
//                 if (
//                     (direction.x === 1 && !currentCell.walls[1] && !nextCell.walls[3]) ||
//                     (direction.x === -1 && !currentCell.walls[3] && !nextCell.walls[1]) ||
//                     (direction.y === 1 && !currentCell.walls[2] && !nextCell.walls[0]) ||
//                     (direction.y === -1 && !currentCell.walls[0] && !nextCell.walls[2])
//                 ) {
//                     if (!visited[nextY][nextX]) {
//                         visited[nextY][nextX] = true;
//                         prev[nextY][nextX] = { x, y };
//                         stack.push({ x: nextX, y: nextY });
//                     }
//                 }
//             }
//         }
//     }

//     // If there's no path found, return an empty array
//     return [];
// }

