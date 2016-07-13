let board = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

let move = false;
let askForXorY = true;
let you = "x";
let computer = "o";

if (move) {
  moveAhead();
}

function choose() {
  let winner = $("#winner");
  if(askForXorY) {
    if(you === "x") {
      you = "o";
      computer = "x";
    } else {
      you = "x";
      computer = "o";
    }
    $("#choose").attr("value", "Change to " + computer.toUpperCase())
  } else {
    winner.text("Can't change right now!");
    setTimeout(function() {
      winner.text("");
    }, 500)
  }
}

function restart() {
  askForXorY = true;
  $("#choose").attr("class", "btn btn-success");
  board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
  move = false;
  updateMove();
}

function updateMove() {
  updateMoves();

  let winner = whoWon(board);

  $("#winner").text(winner === 1 ? "Computer Won!" : winner === 0 ? "You Won!" : winner === -1 ? "Tie!" : "");

  if(winner) {
    setTimeout(function() {
      restart();
    }, 1000)
  }
}

function whoWon(board) {
  let values = [true, false];
  let someMoves = true;
  for (let k = 0; k < values.length; k++) {
    let value = values[k];
    let winLine1 = true;
    let winLine2 = true;
    for (let i = 0; i < 3; i++) {
      if (board[i][i] !== value) {
        winLine1 = false;
      }
      if (board[2 - i][i] !== value) {
        winLine2 = false;
      }
      let rowComplete = true;
      let colComplete = true;
      for (let j = 0; j < 3; j++) {
        if (board[i][j] !== value) {
          rowComplete = false;
        }
        if (board[j][i] !== value) {
          colComplete = false;
        }
        if (board[i][j] === null) {
          someMoves = false;
        }
      }
      if (rowComplete || colComplete) {
        return value ? 1 : 0;
      }
    }
    if (winLine1 || winLine2) {
      return value ? 1 : 0;
    }
  }
  if (someMoves) {
    return -1;
  }
  return null;
}

function updateMoves() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      $("#c" + i + "" + j).text(board[i][j] === false ? you : board[i][j] === true ? computer : "");
    }
  }
}

function moveAhead() {
  board = minMax(board);
  move = false;
  updateMove();
}

function minMax(board) {
  numberOfNodes = 0;
  return minMaxRoutine(board, true)[1];
}

let numberOfNodes = 0;

function minMaxRoutine(board, player) {
  numberOfNodes++;
  let winner = whoWon(board);
  if (winner != null) {
    switch (winner) {
      case 1:
        return [1, board];
      case 0:
        return [-1, board];
      case -1:
        return [0, board];
    }
  } else {
    let nextVal = null;
    let nextBoard = null;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == null) {
          board[i][j] = player;
          let value = minMaxRoutine(board, !player)[0];
          if ((player && (nextVal == null || value > nextVal)) || (!player && (nextVal == null || value < nextVal))) {
            nextBoard = board.map(function (arr) {
              return arr.slice();
            });
            nextVal = value;
          }
          board[i][j] = null;
        }
      }
    }
    return [nextVal, nextBoard];
  }
}

function cellClick() {
  askForXorY = false;
  $("#choose").attr("class", "btn btn-danger");
  let cell = $(this).attr("id");
  let row = parseInt(cell[1]);
  let col = parseInt(cell[2]);
  if (!move && board[row][col] !== false && board[row][col] !== true) {
    board[row][col] = false;
    move = true;
    updateMove();
    moveAhead();
  }
}

updateMove();


$(document).ready(function () {
  $(".cell").click(cellClick);
  $("#restart").click(restart);
  $("#choose").click(choose)
});