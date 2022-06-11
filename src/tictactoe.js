import Board from './components/board/board';
import Narration from './components/narration/narration';


const TicTacToe = (function() {
  'use strict';

  const BOARD_SIZE = 3;
  const bodyEle = document.querySelector("body");

  let player = 0;
  let mode = 0;

  /**
   * Starts a new game of Tic Tac Toee.
   */
  function playGame(gmode=0) {
    mode = gmode;
    bodyEle.appendChild(Narration.getElement());
    bodyEle.appendChild(Board.getBoardElement());
    Board.initBoard(BOARD_SIZE);
    Narration.setTextContent(`It's player ${player+1}'s turn!`);
    Board.enableOnClickForChildren(boardEntryOnClickListener);
  }

  /**
   * An event listener that contains a logic of the 2-player version of Tic Tac Toe.
   * It must be attached to all children of the board.
   */
  function boardEntryOnClickListener(e) {
    const row = this.dataset.row;
    const col = this.dataset.col;
    if (isValidPlay(row, col)) {
      Board.setChildTextContent(row, col, getPlayerEntry());
      Board.removeChildOnClickListener(row, col, boardEntryOnClickListener);

      if (hasPlayerWon()) {
        Narration.setTextContent(`Congratulations ${player+1}! You won!`);
        Board.removeChildrenOnClickListerners(boardEntryOnClickListener);
      } else if (isFull()) {
        Narration.setTextContent("It's a draw.");
        Board.removeChildrenOnClickListerners(boardEntryOnClickListener);
      } else {
        if (mode === 0) {
          twoPlayerGame();
        } else if (mode === 1) {
          easyComp();
        } else if (mode === 2) {
          hardComp();
        } else {
          twoPlayerGame();
        }
      }
    }
  }

  function twoPlayerGame() { 
    changePlayer();
    Narration.setTextContent(`It's player ${player+1}'s turn!`);
  }

  function easyComp() { 
    Narration.setTextContent('Computer is choosing...');
    Board.removeChildrenOnClickListerners(boardEntryOnClickListener);

    // randomly select row and col
    let row, col;
    do {
      row = Math.floor(Math.random() * BOARD_SIZE);
      col = Math.floor(Math.random() * BOARD_SIZE);
    } while (!isValidPlay(row, col));

    Board.setChildTextContent(row, col, getComputerEntry());
    if (hasComputerWon()) {
      Narration.setTextContent(`Computer won!`);
      Board.removeChildrenOnClickListerners(boardEntryOnClickListener);
    } else if (isFull()) {
      Narration.setTextContent("It's a draw.");
      Board.removeChildrenOnClickListerners(boardEntryOnClickListener);
    }
    else {
      Board.enableOnClickForChildren(boardEntryOnClickListener, true);
      Narration.setTextContent(`It's player ${player+1}'s turn!`);
    }
  }

  function hardComp() { 

  }

  function getComputerEntry() {
    return (player === 0) ? 'X' : 'O';
  }

  /**
   * Returns true if the current player is the winner.
   * @returns {boolean}
   */
  function hasPlayerWon() {
    const entry = getPlayerEntry();
    return checkCols(entry) || checkRows(entry) || checkDiags(entry);
  }

  function hasComputerWon() { 
    const entry = getComputerEntry();
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
   * Returns true if the board is full.
   * @returns {boolean}
   */
  function isFull() {
    return Array.from(Board.getAllChildren()).every(child => child.textContent !== '');
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