const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const singlePlayerBtn = document.getElementById('singlePlayerBtn');
        const multiPlayerBtn = document.getElementById('multiPlayerBtn');

        // Maze dimensions
        const mazeWidth = 20;
        const mazeHeight = 20;
        const cellSize = 20;

        let player = { x: 0, y: 0 };
        let maze = [];
        let gameStarted = false;

        singlePlayerBtn.addEventListener('click', () => {
            gameStarted = true;
            player = { x: 0, y: 0 };
            maze = generateMaze(mazeWidth, mazeHeight);
            drawMaze();
            drawPlayer();
        });

        // Maze generation using depth-first search
        function generateMaze(width, height) {
            const maze = Array.from({ length: height }, () => Array(width).fill(true));
            const stack = [];
            const startX = 0, startY = 0;

            function carve(x, y) {
                maze[y][x] = false;

                const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
                directions.sort(() => Math.random() - 0.5);

                directions.forEach(([dx, dy]) => {
                    const nx = x + dx * 2;
                    const ny = y + dy * 2;
                    if (nx >= 0 && ny >= 0 && nx < width && ny < height && maze[ny][nx]) {
                        maze[y + dy][x + dx] = false;
                        carve(nx, ny);
                    }
                });
            }

            carve(startX, startY);
            maze[height - 1][width - 1] = false;
            return maze;
        }

        function drawMaze() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let y = 0; y < mazeHeight; y++) {
                for (let x = 0; x < mazeWidth; x++) {
                    if (maze[y][x]) {
                        ctx.fillStyle = 'black';
                        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    }
                }
            }
        }

        function drawPlayer() {
            ctx.fillStyle = 'red';
            ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
        }

        function movePlayer(dx, dy) {
            const newX = player.x + dx;
            const newY = player.y + dy;
            if (newX >= 0 && newY >= 0 && newX < mazeWidth && newY < mazeHeight && !maze[newY][newX]) {
                player.x = newX;
                player.y = newY;
                drawMaze();
                drawPlayer();
                if (player.x === mazeWidth - 1 && player.y === mazeHeight - 1) {
                    alert('You win!');
                    gameStarted = false;
                }
            }
        }

        window.addEventListener('keydown', (e) => {
            if (gameStarted) {
                switch (e.key) {
                    case 'ArrowUp': movePlayer(0, -1); break;
                    case 'ArrowDown': movePlayer(0, 1); break;
                    case 'ArrowLeft': movePlayer(-1, 0); break;
                    case 'ArrowRight': movePlayer(1, 0); break;
                }
            }
        });