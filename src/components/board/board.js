import bstyles from "./styles.css";

const Board = (function() {
  'use strict';

  const BOARD_SIZE = 3;

  const board = document.createElement("div");
  board.classList.add(bstyles["board-grid"]);
  
  /**
   * Initializes an empty board.
   */
  function initBoard() {
    while (board.firstChild) {
      board.removeChild(board.lastChild);
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const child = document.createElement("div");
        child.classList.add(bstyles["entry"]);
        child.dataset.row = i;
        child.dataset.col = j;
        child.textContent = '';
        board.appendChild(child);
      }
    }
  }


  function getChild(row, col) {
    return document.querySelector(`[data-row='${row}'][data-col='${col}']`);
  }

  function getChildrenOnRow(row) {
    return document.querySelectorAll(`[data-row='${row}']`);
  }

  function getChildrenOnCol(col) {
    return document.querySelectorAll(`[data-col='${col}']`);
  }

  function getAllChildren() { 
    return document.querySelectorAll(`.${bstyles["entry"]}`);
  }

  function setChildTextContent(row, col, str) {
    getChild(row, col).textContent = str;
  }

  function enableOnClickForChildren(listener) { 
    const children = board.querySelectorAll(`.${bstyles["entry"]}`);
    children.forEach(child => {
      child.addEventListener("click", listener);
    });
  }

  function removeChildOnClickListener(row, col, listener) {
    getChild(row, col).removeEventListener("click", listener);
  }

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