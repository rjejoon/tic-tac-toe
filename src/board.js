
const Board = (function() {
  'use strict';

  const BOARD_SIZE = 3;
  let board; 

  /**
   * Initializes the board with nulls.
   */
  function initBoard() {
    board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      board.push([]);
      for (let j = 0; j < BOARD_SIZE; j++) {
        board[i].push(null);
      }
    }
  }

  /**
   * Returns true if any rows of the board is filled with the given entry.
   * @param entry 
   * @returns boolean
   */
  function checkRows(entry) {
    return board.some(row => row.every(e => e === entry));
  }

  /**
   * Returns true if any columns of the board is filled with the given entry.
   * @param entry 
   * @returns boolean
   */
  function checkCols(entry) {
    for (let i=0; i<BOARD_SIZE; i++) {
      const col = [];
      for (let j=0; j<BOARD_SIZE; j++) {
        col.push(board[j][i]);
      }
      if (col.every(e => e === entry)) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Returns true if any diagonals of the board is filled with the given entry.
   * @param entry 
   * @returns boolean
   */
  function checkDiags(entry) {
    const diagonals = [[], []];
    for (let i=0; i<BOARD_SIZE; i++) {
      diagonals[0].push(board[i][i]);
      diagonals[1].push(board[i][BOARD_SIZE-1-i]);
    }
    return diagonals.some(diag => diag.every(e => e === entry));
  }

  /**
   * Returns true if  
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean} 
   */
  function playTurn(row, col, entry) {
    if (!isValidPlay(row, col)) {
      return false;
    }
    board[row][col] = entry;
    return true;
  }
  
  /**
   * Returns true if the board is full.
   * @returns {boolean}
   */
  function isFull() {
    return board.every(row => row.every(e => e !== null));
  }

  /**
   * Returns true if the entry of the given row and col is empty. 
   * Otherwise, returns false.
   * 
   * @param {number} row 
   * @param {number} col 
   * @returns {boolean}
   */
  function isValidPlay(row, col) {
    return board[row][col] === null;
  }

  /**
   * Prints the current state of the board on the console.
   */
  function printBoard() {
    console.table(board);
  }


  return {
    initBoard,
    checkRows,
    checkCols,
    checkDiags,
    isFull,
    printBoard,
    playTurn,
  };

})();

export default Board;