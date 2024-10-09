window.onload = function() {
    let board = ["", "", "", "", "", "", "", "", ""];
    let human = "O";
    let ai = "X";
    let currentPlayer = human;
    const humanimg = "./0.png";
    const aiimg = "./X.png";

    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const tiles = document.querySelectorAll('.tile');
    const messageDiv = document.getElementById('message');
    const messageText = document.getElementById('message-text');
    const okButton = document.getElementById('ok-button');

    tiles.forEach(tile => tile.addEventListener('click', handleClick));
    okButton.addEventListener('click', resetGame);

    function handleClick(event) {
        const index = event.target.getAttribute('data-index');
        if (board[index] === "" && currentPlayer === human) {
            board[index] = human;
            event.target.innerHTML = `<img src="${humanimg}" alt="O" class="player-img"/>`;

            if (!checkWin(board, human) && !isTie()) {
                setTimeout(() => {
                    currentPlayer = ai;
                    bestMove();
                }, 100);
            } else if (checkWin(board, human)) {
                showMessage("Human wins!");
            } else if (isTie()) {
                showMessage("It's a tie!");
            }
        }
    }

    function bestMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = ai;
                let score = minimax(board, 0, false);
                board[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        board[move] = ai;
        tiles[move].innerHTML = `<img src="${aiimg}" alt="X" class="player-img">`;
        currentPlayer = human;
        if (checkWin(board, ai)) {
            showMessage("AI wins!");
        } else if (isTie()) {
            showMessage("It's a tie!");
        }
    }

    function showMessage(msg) {
        messageText.textContent = msg; // Set the message text
        messageDiv.style.display = "block"; // Show the message div
    }

    function resetGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = human;
        tiles.forEach(tile => {
            tile.innerHTML = ""; // Clear all tiles
        });
        messageDiv.style.display = "none"; // Hide the message div
    }

    function minimax(board, depth, isMaximizing) {
        let scores = {
            X: 10,
            O: -10,
            tie: 0
        };

        let result = checkWin(board, ai) ? ai : checkWin(board, human) ? human : isTie() ? "tie" : null;
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = ai;
                    let score = minimax(board, depth + 1, false);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = human;
                    let score = minimax(board, depth + 1, true);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkWin(board, player) {
        return winCombos.some(combo => combo.every(index => board[index] === player));
    }

    function isTie() {
        return board.every(cell => cell !== "");
    }
};
