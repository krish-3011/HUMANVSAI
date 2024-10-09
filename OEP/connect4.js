document.addEventListener('DOMContentLoaded', function () {
    const AI_PLAYER = 1;    // AI player identifier
    const HUMAN_PLAYER = -1; // Human player identifier
    const EMPTY = 0;         // Empty cell
    const ROWS = 4;          // Set to 4 for a 4x4 board
    const COLS = 5;          // Set to 4 for a 4x4 board
    let board;
    let currentPlayer;
    let gameOver = false;
    const MAX_DEPTH = 5; // Limit depth for Minimax

    // Initialize the board and create tiles dynamically
    function createBoard() {
        board = [];
        const gameBoard = document.getElementById('gameboard');
        gameBoard.innerHTML = ''; // Clear previous game board

        for (let row = 0; row < ROWS; row++) {
            const newRow = [];
            for (let col = 0; col < COLS; col++) {
                newRow.push(EMPTY);
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.dataset.row = row;
                tile.dataset.col = col;
                tile.addEventListener('click', handleTileClick); // Listen for clicks on tiles
                gameBoard.appendChild(tile);
            }
            board.push(newRow);
        }

        currentPlayer = HUMAN_PLAYER;
        gameOver = false;
        document.getElementById('status').textContent = 'Your turn!';
    }

    // Handle tile clicks by the human player
    function handleTileClick(event) {
        if (gameOver || currentPlayer !== HUMAN_PLAYER) return;

        const col = event.target.dataset.col; // Get column index
        if (makeMove(board, col, HUMAN_PLAYER)) {
            updateBoard();
            if (checkWin(board, HUMAN_PLAYER)) {
                gameOver = true;
                document.getElementById('status').textContent = 'You win!';
            } else {
                currentPlayer = AI_PLAYER;
                document.getElementById('status').textContent = 'AI thinking...';
                setTimeout(() => {
                    aiMove();
                }, 500); // Simulate AI "thinking" for a moment
            }
        }
    }

    // AI makes its move using the Minimax algorithm
    function aiMove() {
        const bestMove = getBestMove(board); // Get the best move using Minimax
        makeMove(board, bestMove, AI_PLAYER);
        updateBoard();

        if (checkWin(board, AI_PLAYER)) {
            gameOver = true;
            document.getElementById('status').textContent = 'AI wins!';
        } else {
            currentPlayer = HUMAN_PLAYER;
            document.getElementById('status').textContent = 'Your turn!';
        }
    }

    // Update the tile colors based on the board state
    function updateBoard() {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            const row = tile.dataset.row;
            const col = tile.dataset.col;
            const player = board[row][col];
            if (player === AI_PLAYER) {
                tile.dataset.player = AI_PLAYER;
            } else if (player === HUMAN_PLAYER) {
                tile.dataset.player = HUMAN_PLAYER;
            } else {
                tile.removeAttribute('data-player');
            }
        });
    }

    // Make a move on the board
    function makeMove(board, col, player) {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][col] === EMPTY) {
                board[row][col] = player;
                return true;
            }
        }
        return false;
    }

    // Undo a move
    function undoMove(board, col) {
        for (let row = 0; row < ROWS; row++) {
            if (board[row][col] !== EMPTY) {
                board[row][col] = EMPTY;
                break;
            }
        }
    }

    // Get available moves (columns where tiles can be dropped)
    function getAvailableMoves(board) {
        const moves = [];
        for (let col = 0; col < COLS; col++) {
            if (board[0][col] === EMPTY) {
                moves.push(col);
            }
        }
        return moves;
    }

    // Check for a winning condition (horizontal, vertical, diagonal)
    function checkWin(board, player) {
        // Check horizontal
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                if (board[row][col] === player &&
                    board[row][col + 1] === player &&
                    board[row][col + 2] === player &&
                    board[row][col + 3] === player) {
                    return true;
                }
            }
        }

        // Check vertical
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS - 3; row++) {
                if (board[row][col] === player &&
                    board[row + 1][col] === player &&
                    board[row + 2][col] === player &&
                    board[row + 3][col] === player) {
                    return true;
                }
            }
        }

        // Check diagonal (bottom-left to top-right)
        for (let row = 3; row < ROWS; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                if (board[row][col] === player &&
                    board[row - 1][col + 1] === player &&
                    board[row - 2][col + 2] === player &&
                    board[row - 3][col + 3] === player) {
                    return true;
                }
            }
        }

        // Check diagonal (top-left to bottom-right)
        for (let row = 0; row < ROWS - 3; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                if (board[row][col] === player &&
                    board[row + 1][col + 1] === player &&
                    board[row + 2][col + 2] === player &&
                    board[row + 3][col + 3] === player) {
                    return true;
                }
            }
        }

        return false; // No win found
    }

    // Get the best move for the AI using Minimax
    function getBestMove(board) {
        let bestValue = -Infinity;
        let bestMove = -1;

        // Iterate over all possible moves
        for (let col of getAvailableMoves(board)) {
            // Simulate the move
            makeMove(board, col, AI_PLAYER);
            // Get the minimax value for this move
            let moveValue = minimax(board, MAX_DEPTH, false);
            // Undo the move
            undoMove(board, col);
            
            // Update best move if this move is better
            if (moveValue > bestValue) {
                bestValue = moveValue;
                bestMove = col;
            }
        }

        return bestMove;
    }

    // Minimax algorithm with heuristic evaluation
    function minimax(board, depth, isMaximizing) {
        if (checkWin(board, AI_PLAYER)) {
            return 10; // AI wins
        }
        if (checkWin(board, HUMAN_PLAYER)) {
            return -10; // Human wins
        }
        if (getAvailableMoves(board).length === 0) {
            return 0; // Draw
        }
        if (depth === 0) {
            return evaluateBoard(board); // Use heuristic evaluation
        }

        if (isMaximizing) {
            let bestValue = -Infinity;
            for (let col of getAvailableMoves(board)) {
                makeMove(board, col, AI_PLAYER);
                bestValue = Math.max(bestValue, minimax(board, depth - 1, false));
                undoMove(board, col);
            }
            return bestValue;
        } else {
            let bestValue = Infinity;
            for (let col of getAvailableMoves(board)) {
                makeMove(board, col, HUMAN_PLAYER);
                bestValue = Math.min(bestValue, minimax(board, depth - 1, true));
                undoMove(board, col);
            }
            return bestValue;
        }
    }

    // Heuristic evaluation function to assess the board
    function evaluateBoard(board) {
        let score = 0;

        // Evaluate rows
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                score += evaluateLine(board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]);
            }
        }

        // Evaluate columns
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS - 3; row++) {
                score += evaluateLine(board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]);
            }
        }

        // Evaluate diagonals (bottom-left to top-right)
        for (let row = 3; row < ROWS; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                score += evaluateLine(board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3]);
            }
        }

        // Evaluate diagonals (top-left to bottom-right)
        for (let row = 0; row < ROWS - 3; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                score += evaluateLine(board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]);
            }
        }

        return score; // Return the final score
    }

    // Evaluate a line (row, column, or diagonal)
    function evaluateLine(a, b, c, d) {
        let score = 0;
        const players = [AI_PLAYER, HUMAN_PLAYER];

        for (let player of players) {
            const count = [0, 0]; // [AI count, Human count]
            const emptyCount = [0, 0]; // [AI empty count, Human empty count]

            if (a === player) count[0]++;
            else if (a === EMPTY) emptyCount[0]++;
            if (b === player) count[0]++;
            else if (b === EMPTY) emptyCount[0]++;
            if (c === player) count[0]++;
            else if (c === EMPTY) emptyCount[0]++;
            if (d === player) count[0]++;
            else if (d === EMPTY) emptyCount[0]++;

            // Scoring logic
            if (count[0] === 4) score += 100; // Winning line for AI
            else if (count[0] === 3 && emptyCount[0] === 1) score += 5; // AI can win next turn
            else if (count[0] === 2 && emptyCount[0] === 2) score += 2; // AI can create opportunity

            count[1] = 0; // Reset for human player evaluation
            emptyCount[1] = 0; // Reset for human player evaluation

            if (a === -player) count[1]++;
            else if (a === EMPTY) emptyCount[1]++;
            if (b === -player) count[1]++;
            else if (b === EMPTY) emptyCount[1]++;
            if (c === -player) count[1]++;
            else if (c === EMPTY) emptyCount[1]++;
            if (d === -player) count[1]++;
            else if (d === EMPTY) emptyCount[1]++;

            // Scoring logic for human
            if (count[1] === 4) score -= 100; // Winning line for human
            else if (count[1] === 3 && emptyCount[1] === 1) score -= 5; // Human can win next turn
            else if (count[1] === 2 && emptyCount[1] === 2) score -= 2; // Human can create opportunity
        }

        return score; // Return the final score for this line
    }

    // Restart game on button click
    document.getElementById('restart-btn').addEventListener('click', createBoard);

    // Initialize the game board when the page loads
    createBoard();
});
