import Board from './components/board/board';
import Narration from './components/narration/narration';


const TicTacToe = (function() {
  'use strict';

  const BOARD_SIZE = 3;
  const bodyEle = document.querySelector("body");

  let player = 0;

  function playGame() {
    bodyEle.appendChild(Narration.getElement());
    bodyEle.appendChild(Board.getBoardElement());
    Board.initBoard();
    Narration.setTextContent(`It's player ${player+1}'s turn!`);
    Board.enableOnClickForChildren(boardEntryOnClickListener);
  }

  function boardEntryOnClickListener(e) {
    console.log(this);
    const row = this.dataset.row;
    const col = this.dataset.col;
    if (isValidPlay(row, col)) {
      Board.setChildTextContent(row, col, getPlayerEntry());
      Board.removeChildOnClickListener(row, col, boardEntryOnClickListener);

      if (hasPlayerWon()) {
        Narration.setTextContent(`Congratulations ${player+1}! You won!`);
        Board.removeChildrenOnClickListerners(boardEntryOnClickListener);
      } else if (isFull()) {
        Narration.setTextContent("It's a draw");
        Board.removeChildrenOnClickListerners(boardEntryOnClickListener);
      } else {
        changePlayer();
        Narration.setTextContent(`It's player ${player+1}'s turn!`);
      }
    }


  }
  
  function hasPlayerWon() {
    const entry = getPlayerEntry();
    return checkCols(entry) || checkRows(entry) || checkDiags(entry);
  }

  function changePlayer() {
    player = (player + 1) % 2;
  }

  function getPlayerEntry() {
    return (player === 0) ? 'O' : 'X';
  }

  /**
   * Returns true if any rows of the board is filled with the given entry.
   * @param entry 
   * @returns {boolean}
   */
  function checkRows(entry) {
    for (let i=0; i<BOARD_SIZE; i++) {
      const row = Array.from(Board.getChildrenOnRow(i));
      if (row.every(child => child.textContent === entry)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns true if any columns of the board is filled with the given entry.
   * @param entry 
   * @returns boolean
   */
  function checkCols(entry) {
    for (let i=0; i<BOARD_SIZE; i++) {
      const col = Array.from(Board.getChildrenOnCol(i));
      if (col.every(child => child.textContent === entry)) {
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
      diagonals[0].push(Board.getChild(i, i));
      diagonals[1].push(Board.getChild(i, BOARD_SIZE-1-i));
    }
    return diagonals.some(diag => diag.every(child => child.textContent === entry));
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
    Board.setChildTextContent(row, col, entry);
    return true;
  }
  
  /**
   * Returns true if the board is full.
   * @returns {boolean}
   */
  function isFull() {
    return false;
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
    return Board.getChild(row, col).textContent === '';
  }

  return {
    playGame,
  }
})();

export default TicTacToe;