import bstyles from "./styles.css";

const Board = (function() {
  'use strict';

  const board = document.createElement("div");
  board.classList.add(bstyles["board-grid"]);
  
  /**
   * Initializes an empty board.
   */
  function initBoard(dim) {
    while (board.firstChild) {
      board.removeChild(board.lastChild);
    }

    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        const child = document.createElement("div");
        child.classList.add(bstyles["entry"]);
        child.dataset.row = i;
        child.dataset.col = j;
        child.textContent = '';
        board.appendChild(child);
      }
    }
  }

  /**
   * Returns a child element of the board located at the specified row and col.
   * @param {number} row 
   * @param {number} col 
   * @returns {HTMLElement}
   */
  function getChild(row, col) {
    return document.querySelector(`[data-row='${row}'][data-col='${col}']`);
  }

  /**
   * Returns all children of the board located at the specified row.
   * @param {number} row 
   * @returns {NodeList}
   */
  function getChildrenOnRow(row) {
    return document.querySelectorAll(`[data-row='${row}']`);
  }

  /**
   * Returns all children of the board located at the specified column.
   * @param {number} col
   * @returns {NodeList}
   */
  function getChildrenOnCol(col) {
    return document.querySelectorAll(`[data-col='${col}']`);
  }

  /**
   * Returns all children of the board.
   * @returns {NodeList}
   */
  function getAllChildren() { 
    return document.querySelectorAll(`.${bstyles["entry"]}`);
  }

  /**
   * Sets the textContent of the child element of the board 
   * located at the specified row and column.
   * @param {number} row 
   * @param {number} col 
   * @param {string} str 
   */
  function setChildTextContent(row, col, str) {
    getChild(row, col).textContent = str;
  }

  /**
   * Attaches the given event listener to all children of the board.
   * @param {function} listener 
   */
  function enableOnClickForChildren(listener) { 
    const children = board.querySelectorAll(`.${bstyles["entry"]}`);
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
  function removeChildOnClickListener(row, col, listener) {
    getChild(row, col).removeEventListener("click", listener);
  }

  /**
   * Removes the attached listener from all children of the board.
   * @param {function} listener 
   */
  function removeChildrenOnClickListerners(listener) { 
    const children = board.querySelectorAll(`.${bstyles["entry"]}`);
    children.forEach(child => child.removeEventListener("click", listener));
  }

  function getBoardElement() { return board; }


  return {
    initBoard,
    getBoardElement,
    getChild,
    getChildrenOnRow,
    getChildrenOnCol,
    getAllChildren,
    setChildTextContent,
    enableOnClickForChildren,
    removeChildOnClickListener,
    removeChildrenOnClickListerners,
  };

})();

export default Board;