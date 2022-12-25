let X_PIECE = "X";
let O_PIECE = "O";

let movesPlayed = 0;
let turn = 1; // X = 1 and O = -1
let difficulty = 2;
let inGame = false;
let board = new Array(9).fill(0);


const newGame = function(playerPiece, startDifficulty) {
    movesPlayed = 0;
    turn = 1;
    difficulty = startDifficulty;
    inGame = true;
    board = new Array(9).fill(0);
    clearCanvas();

    if (playerPiece == "O") {
        botTurn();
    }  
};

const placePiece = function() {
    if (inGame && !board[this.id[6]]) {
        if (turn == 1) {
            drawX(this.id[6]);
        } else {
            drawO(this.id[6]);
        }
                
        board[this.id[6]] = turn;
        movesPlayed += 1;
        
        let winner = checkWin(true);
        inGame = !winner && board.includes(0);

        // Update game state
        if (inGame) {
            turn *= -1;
            botTurn();
        }
    }
};

const checkWin = function(drawWins) {
    // Check rows and columns
    for (let i = 0; i < 3; i++) {
        if (board[3*i] != 0 && board[3*i] == board[3*i + 1] && board[3*i] == board[3*i + 2]) {
            if (drawWins) {
                drawWin(3*i, 3*i + 2);
            }
            return board[3*i];
        } else if (board[i] != 0 && board[i] == board[3 + i] && board[i] == board[6 + i]) {
            if (drawWins) {
                drawWin(i, 6 + i);
            }
            return board[i];
        }
    }

    // Check both diagonals
    if (board[0] != 0 && board[0] == board[4] && board[0]  == board[8]) {
        if (drawWins) {
            drawWin(0, 8);
        }
        return board[0];
    }
    if (board[2] != 0 && board[2] == board[4] && board[2]  == board[6]) {
        if (drawWins) {
            drawWin(2, 6);
        }
        return board[2];
    }

    return 0;
};


////
//// Tic Tac Toe Bot min-max algorithm with alpha-beta pruning
////
const botTurn = function() {
    let squareNum = minmax();
    if (turn == 1) {
        drawX(squareNum);
    } else {
        drawO(squareNum);
    }
    
    board[squareNum] = turn;
    movesPlayed += 1;
    
    let winner = checkWin(true);
    inGame = !winner && board.includes(0);

    // Update game turn state
    if (inGame) {
        turn *= -1;
    }
};

const minmax = function() {
    let idealMoves = [];
    let idealMovesDepth = [];
    let neutralMoves = [];
    let badMoves = [];
    let badMovesDepth = [];
    
    for (let i = 0; i < board.length; i++) {
        let value = [10, 0];
        if (board[i] == 0) {
            board[i] = turn;
            value = minimum(value, abMaxVal(0, -10, 10))
            board[i] = 0;

            if (value[0] < 0) {
                idealMoves.push(i);
                idealMovesDepth.push(value[1]);
            } else if (value[0] == 0) {
                neutralMoves.push(i);
            } else {
                badMoves.push(i);
                badMovesDepth.push(value[1]);
            }
        }
    }
    
    // Select square for CPU move
    // Randomness for Easy and Medium's first 1 or 2 moves
    let randomVal = 0;
    if (movesPlayed < 3 && difficulty != 0) {
        randomVal = Math.random() / (3 - difficulty);
    }

    let square = board.indexOf(0);
    if ((idealMoves.length && randomVal < 0.1) || (!neutralMoves.length && !badMoves.length)) {
        square = idealMoves[argmin(idealMovesDepth)];
    } else if ((neutralMoves.length && randomVal < 0.2) || (!badMoves.length)) {
        square = neutralMoves[Math.floor(Math.random() * neutralMoves.length)];
    } else {
        square = badMoves[argmax(badMovesDepth)];
    }
    return square;
};

const argmin = function(arr) {
    if (!arr.length) {
        return -1;
    }
    
    let min = arr[0];
    let minIndex = 0;
    for (let i = 1; i < arr.length; i++) {
        let randomSelector = Math.random();
        if ((arr[i] < min) || (arr[i] == min && randomSelector > 0.5)) {
            min = arr[i];
            minIndex = i;
        }
    }
    return minIndex;
};

const argmax = function(arr) {
    if (!arr.length) {
        return -1;
    }
    
    let max = arr[0];
    let maxIndex = 0;
    for (let i = 1; i < arr.length; i++) {
        let randomSelector = Math.random();
        if ((arr[i] > max) || (arr[i] == max && randomSelector > 0.5)) {
            max = arr[i];
            maxIndex = i;
        }
    }
    return maxIndex;
};

const abMinVal = function(moves, alpha, beta) {
    let winner = checkWin(false);
    if (winner) {
        return [winner * -turn, moves];
    }

    let value = [10, 0];
    moves += 1;
    for (let i = 0; i < board.length; i++) {
        if (board[i] == 0) {
            board[i] = turn;
            value = minimum(value, abMaxVal(moves, alpha, beta))

            board[i] = 0;
            if (value[0] <= alpha) {
                return value;
            }
            beta = Math.min(beta, value[0]);
        }
    }
    if (value[0] == 10) {
        return [0, moves];
    }
    return value;
};

const abMaxVal = function(moves, alpha, beta) {
    let winner = checkWin(false);
    if (winner) {
        return [winner * -turn, moves];
    }

    let value = [-10, 0];
    moves += 1;
    for (let i = 0; i < board.length; i++) {
        if (board[i] == 0) {
            board[i] = turn * -1;
            value = maximum(value, abMinVal(moves, alpha, beta))

            board[i] = 0;
            if (value[0] >= beta) {
                return value
            }
            alpha = Math.max(alpha, value[0]);
        }
    }
    if (value[0] == -10) {
        return [0, moves];
    }
    return value;
};

const minimum = function(values1, values2) {
    if (values1[0] < values2[0]) {
        return values1;
    } else if (values1[0] > values2[0]) {
        return values2;
    } 

    // index 1 result values are the same, so find larger moves/depth to prolong game
    if (values1[1] > values2[1]) {
        return values1;
    } else if (values1[1] < values2[1]) {
        return values2;
    }

    return values1;
};

const maximum = function(values1, values2) {
    if (values1[0] > values2[0]) {
        return values1;
    } else if (values1[0] < values2[0]) {
        return values2;
    } 

    // index 1 result values are the same, so find smaller moves/depth because we assume player is playing optimally
    if (values1[1] < values2[1]) {
        return values1;
    } else if (values1[1] > values2[1]) {
        return values2;
    }

    return values1;
}


////
//// Draw board and pieces on canvas
////
const clearCanvas = function() {
    let canvas = document.getElementById("game-canvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw board
    drawBoard();
};

const drawBoard = function() {
    let canvas = document.getElementById("game-canvas");
    let ctx = canvas.getContext("2d");

    ctx.lineWidth = "20";
    ctx.strokeStyle = "rgb(175, 120, 85)"; 

    for (let col = 1; col <= 2; col++) {
        ctx.beginPath();
        ctx.moveTo(140 * col - 10, 0);
        ctx.lineTo(140 * col - 10, 402);
        ctx.stroke();
    }

    for (let row = 1; row <= 2; row++) {
        ctx.beginPath();
        ctx.moveTo(1, 140 * row - 10);
        ctx.lineTo(402, 140 * row - 10);
        ctx.stroke();
    }
};

const drawX = function(square) {
    let canvas = document.getElementById("game-canvas");
    let ctx = canvas.getContext("2d");

    let row = Math.floor(square / 3);
    let col = square % 3;

    ctx.lineWidth = "16";
    ctx.strokeStyle = "rgb(96, 59, 42)";

    ctx.beginPath();
    ctx.moveTo(140 * col + 20, 140 * row + 20);
    ctx.lineTo(140 * col + 100, 140 * row + 100);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(140 * col + 20, 140 * row + 100);
    ctx.lineTo(140 * col + 100, 140 * row + 20);
    ctx.stroke();
};

const drawO = function(square) {
    let canvas = document.getElementById("game-canvas");
    let ctx = canvas.getContext("2d");

    let row = Math.floor(square / 3);
    let col = square % 3;

    ctx.lineWidth = "16";
    ctx.strokeStyle = "rgb(96, 59, 42)";

    ctx.beginPath();
    ctx.arc(140 * col + 60, 140 * row + 60, 40, 0, 2 * Math.PI);
    ctx.stroke();
};

const drawWin = function(first, last) {
    let canvas = document.getElementById("game-canvas");
    let ctx = canvas.getContext("2d");

    let row1 = Math.floor(first / 3);
    let col1 = first % 3;

    let row2 = Math.floor(last / 3);
    let col2 = last % 3;

    ctx.beginPath(); 
    ctx.lineWidth = "16"; 
    ctx.strokeStyle = "red"; 
    ctx.moveTo(140 * col1 + 60, 140 * row1 + 60);
    ctx.lineTo(140 * col2 + 60, 140 * row2 + 60);
    ctx.stroke();
};


////
//// Initialize and add event listeners
////
window.onload = function() {
    drawBoard();
    
    document.getElementById("game-settings").addEventListener("submit", (e) => {
        e.preventDefault();

        const settingsData = new FormData(e.target);
        newGame(settingsData.get("piece"), settingsData.get("difficulty"));      
    });

    for (let i = 0; i < 9; i++) {
        document.getElementById("square" + i).onclick = placePiece;
    }
};


