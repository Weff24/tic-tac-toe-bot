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
    clearBoard();
    clearCanvas();

    if (playerPiece == "O") {
        botTurn();
    }  
};

const clearBoard = function() {
    for (let i = 0; i < board.length; i++) {
        document.getElementById("square" + i).innerHTML = "";
    }
};

const placePiece = function() {
    if (inGame && !document.getElementById(this.id).innerHTML) {
        let piece = X_PIECE;
        if (turn == -1) {
            piece = O_PIECE;
        }
        document.getElementById(this.id).innerHTML = piece;
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

const botTurn = function() {
    let squareNum = minmax();
    let piece = X_PIECE;
    if (turn == -1) {
        piece = O_PIECE;
    }
    console.log(squareNum)////////////////////////////////////////////////////
    document.getElementById("square" + squareNum).innerHTML = piece;
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
    let neutralMoves = [];
    let badMoves = [];
    
    for (let i = 0; i < board.length; i++) {
        let value = 10;
        if (board[i] == 0) {
            board[i] = turn;
            value = Math.min(value, abMaxVal(-10, 10))
            board[i] = 0;

            if (value < 0) {
                idealMoves.push(i);
            } else if (value == 0) {
                neutralMoves.push(i);
            } else {
                badMoves.push(i);
            }
        }
    }
    
    // Select square for CPU move
    // Randomness for Easy's first 2 moves
    // Randomness for Medium's first move
    let randomVal = 0;
    if (movesPlayed < 2 * difficulty) {
        randomVal = Math.random();
    }

    let square = badMoves[Math.floor(Math.random() * badMoves.length)];
    if (idealMoves.length && randomVal < 0.33) {
        square = idealMoves[Math.floor(Math.random() * idealMoves.length)];
    } else if (neutralMoves.length && randomVal < 0.66) {
        square = neutralMoves[Math.floor(Math.random() * neutralMoves.length)];
    }
    console.log(idealMoves)
    console.log(neutralMoves)
    console.log(badMoves)
    return square;
};

const abMinVal = function(alpha, beta) {
    let winner = checkWin(false);
    if (winner) {
        return winner * -turn;
        // return winner;
    }

    value = 10;
    for (let i = 0; i < board.length; i++) {
        if (board[i] == 0) {
            board[i] = turn;
            // board[i] = -1;
            value = Math.min(value, abMaxVal(alpha, beta))
            board[i] = 0;
            if (value <= alpha) {
                return value;
            }
            beta = Math.min(beta, value);
        }
    }
    if (value == 10) {
        return 0;
    }
    return value;
};

const abMaxVal = function(alpha, beta) {
    let winner = checkWin(false);
    if (winner) {
        return winner * -turn;
        // return winner;
    }

    value = -10;
    for (let i = 0; i < board.length; i++) {
        if (board[i] == 0) {
            board[i] = turn * -1;
            // board[i] = 1;
            value = Math.max(value, abMinVal())
            board[i] = 0;
            if (value >= beta) {
                return value;
            }
            alpha = Math.max(alpha, value);
        }
    }
    if (value == -10) {
        return 0;
    }
    return value;
};

// redrawBoard()
const clearCanvas = function() {
    let canvas = document.getElementById("game-canvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw board later
};

const drawWin = function(first, last) {
    let canvas = document.getElementById("game-canvas");
    let ctx = canvas.getContext("2d");

    let row1 = Math.floor(first / 3);
    let col1 = first % 3;

    let row2 = Math.floor(last / 3);
    let col2 = last % 3;

    ctx.beginPath(); 
    ctx.lineWidth="8";
    ctx.strokeStyle="red"; 
    ctx.moveTo(170*col1 + 76, 170*row1 + 75);
    ctx.lineTo(170*col2 + 76, 170*row2 + 75);
    ctx.stroke();
};

window.onload = function() {
    document.getElementById("game-settings").addEventListener("submit", (e) => {
        e.preventDefault();

        const settingsData = new FormData(e.target);
        newGame(settingsData.get("piece"), settingsData.get("difficulty"));      
    });

    for (let i = 0; i < 9; i++) {
        document.getElementById("square" + i).onclick = placePiece;
    }
};


