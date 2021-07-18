

const Board = (function() {
  'use strict';

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
    
    for (let col=0; col<3; col++) {
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
    return false;

  }

  function playTurn(row, col) {
    const fill = isPlayer1Turn ? 'O' : 'X';

    if (board[row][col] === '_') {
      board[row][col] = fill;
    }

    isPlayer1Turn = !isPlayer1Turn;     // change turn
  }


  return {
    areRowsFull,
    areColsFull,
    areDiagonalsFull,
    isDone,
  };

})();

console.log(Board.isDone());
