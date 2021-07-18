

const Board = (function() {
  'use strict';

  const BOARD_SIZE = 3;
  const board = [['_', '_', '_'],
                 ['_', '_', '_'],
                 ['_', '_', '_']];

  let isPlayer1Turn = true;
  
  function isDone() {
    return areRowsFull() || areColsFull() || areDiagonalsFull();
  }

  function areRowsFull() {
    return board.some(row => row.every(entry => entry === 'O') || row.every(entry => entry === 'X'));
  }

  function areColsFull() {
    
    for (let col=0; col<BOARD_SIZE; col++) {
      let firstEntry;
      let isGameDone = true;

      for (const row of board) {
        if (!firstEntry) {
          firstEntry = row[col];
        }
        if ((firstEntry === '_') || (row[col] !== firstEntry)) {
          isGameDone = false;
        }
      }

      if (isGameDone) {
        return true;
      }
    }

    return false;
  }
  
  function areDiagonalsFull() {

    let firstEntry = null;
    let isGameDone = true;

    for (let i=0; i<BOARD_SIZE; i++) {
      if (!firstEntry) {
        firstEntry = board[i][i];
      }
      if ((firstEntry === '_') || (board[i][i] !== firstEntry)) {
        isGameDone = false;
      }
    }

    if (isGameDone) return true;

    firstEntry = null;
    isGameDone = true;

    for (let i=0; i<BOARD_SIZE; i++) {
      if (!firstEntry) {
        firstEntry = board[BOARD_SIZE-1 -i][i];
      }
      if ((firstEntry === '_') || (board[BOARD_SIZE-1 - i][i] !== firstEntry)) {
        isGameDone = false;
      }
    }

    return isGameDone;
  }

  function playTurn(row, col) {
    const fill = isPlayer1Turn ? 'O' : 'X';

    if (board[row][col] === '_') {
      board[row][col] = fill;
    }

    isPlayer1Turn = !isPlayer1Turn;     // change turn
  }


  return {
    isDone,
  };

})();

console.log(Board.isDone());
