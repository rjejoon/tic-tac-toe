import bstyles from "./styles.css";

const Board = (function() {
  'use strict';

  let board;
  const boardEle = document.createElement("div");
  boardEle.classList.add(bstyles["board-grid"]);
  
  /**
   * Initializes an empty square dim x dim board.
   */
  function initBoard(dim) {
    board = [];
    while (boardEle.firstChild) {
      boardEle.removeChild(boardEle.lastChild);
    }

    for (let i = 0; i < dim; i++) {
      board.push([]);
      for (let j = 0; j < dim; j++) {
        const child = document.createElement("div");
        child.classList.add(bstyles["entry"]);
        child.dataset.row = i;
        child.dataset.col = j;
        child.textContent = '';
        boardEle.appendChild(child);

        board[i].push('');
      }
    }
  }

  /**
   * Returns a child element of the board located at the specified row and col.
   * @param {number} row 
   * @param {number} col 
   * @returns {HTMLElement}
   */
  function getChildElement(row, col) {
    return document.querySelector(`[data-row='${row}'][data-col='${col}']`);
  }

  function getEntry(row, col) {
    return board[row][col];
  }

  function getEntriesRow(row) {
    return board[row];
  }

  function getEntriesCol(col) {
    const ret = [];
    for (let i = 0; i < board.length; i++) {
      ret.push(board[i][col]);
    }
    return ret;
  }

  /**
   * Sets the textContent of the child element of the board 
   * located at the specified row and column.
   * Also updates board arr.
   * @param {number} row 
   * @param {number} col 
   * @param {string} str 
   */
  function setEntry(row, col, str) {
    getChildElement(row, col).textContent = str;
    board[row][col] = str;
  }

  /**
   * Attaches the given event listener to all children of the board.
   * @param {function} listener 
   */
  function enableCellsOnClickListener(listener, onlyValid=false) { 
    const children = Array.from(boardEle.querySelectorAll(`.${bstyles["entry"]}`));
    if (onlyValid) {
      children.filter(child => child.textContent !== '');
    }
    children.forEach(child => {
      child.addEventListener("click", listener);
    });
  }

  /**
   * Removes the attached listener from the child element of the board 
   * located at the specified row and column.
   * @param {number} row 
   * @param {number} col 
   * @param {function} listener 
   */
  function removeCellOnClickListener(row, col, listener) {
    getChildElement(row, col).removeEventListener("click", listener);
  }

  /**
   * Removes the attached listener from all children of the board.
   * @param {function} listener 
   */
  function removeCellsOnClickListerners(listener) { 
    const children = boardEle.querySelectorAll(`.${bstyles["entry"]}`);
    children.forEach(child => child.removeEventListener("click", listener));
  }

  function getBoardElement() { return boardEle; }

  function getBoard() { return board; }



  return {
    initBoard,
    getBoardElement,
    setEntry,
    enableCellsOnClickListener,
    removeCellOnClickListener,
    removeCellsOnClickListerners,
    getEntry,
    getEntriesRow,
    getEntriesCol,
    getBoard,
  };

})();

export default Board;