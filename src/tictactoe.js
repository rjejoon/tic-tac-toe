import Board from './components/board/board';
import Narration from './components/narration/narration';


const TicTacToe = (function() {
  'use strict';

  const MAX_PLAYER = 2;
  const BOARD_SIZE = 3;
  const bodyEle = document.querySelector("body");

  let player = 0;
  // mode === 0: 2 player
  // mode === 1: easy computer
  // mode === 2: hard computer
  let mode = 0;
  let computer = 1;   // default: computer is player === 1

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
        Narration.setTextContent(`Congratulations player ${player+1}! You won!`);
        Board.removeChildrenOnClickListerners(boardEntryOnClickListener);
      } else if (isFull()) {
        Narration.setTextContent("It's a draw.");
        Board.removeChildrenOnClickListerners(boardEntryOnClickListener);
      } else {
        changePlayer();
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
      changePlayer();
      Board.enableOnClickForChildren(boardEntryOnClickListener, true);
      Narration.setTextContent(`It's player ${player+1}'s turn!`);
    }
  }

  function getComputerEntry() {
    if (computer === 0) {
      return (player === computer) ? 'O' : 'X';
    }
    return (player === computer) ? 'X' : 'O';
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
    if (mode > 0) {
      return (computer === 0) ? 'X' : 'O';
    }
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

  function hardComp() { 
    Narration.setTextContent('Computer is choosing...');
    Board.removeChildrenOnClickListerners(boardEntryOnClickListener);

    // find the best action for the computer
    const actionValuePairs = A(currState()).map(a => [a, minimax(T(currState(), a))]);
    let bestPair = actionValuePairs[0];
    actionValuePairs.forEach(pair => {
      if (pair[1] > bestPair[1]) {
        bestPair = pair;
      }
    })

    let [row, col] = bestPair[0];

    Board.setChildTextContent(row, col, getComputerEntry());
    if (hasComputerWon()) {
      Narration.setTextContent(`Computer won!`);
      Board.removeChildrenOnClickListerners(boardEntryOnClickListener);
    } else if (isFull()) {
      Narration.setTextContent("It's a draw.");
      Board.removeChildrenOnClickListerners(boardEntryOnClickListener);
    }
    else {
      changePlayer();
      Board.enableOnClickForChildren(boardEntryOnClickListener, true);
      Narration.setTextContent(`It's player ${player+1}'s turn!`);
    }
  }

  function minimax(state, alpha=-Infinity, beta=Infinity) {
    if (isTerminal(state)) {
      return U(state);
    }
    let M = state.isComputerTurn ? -Infinity : Infinity;
    A(state).forEach(a => {
      if (state.isComputerTurn) {
        M = Math.max(M, minimax(T(state, a), alpha, beta));
        if (M >= beta) {
          return M;
        }
        alpha = Math.max(alpha, M);
      } else {
        M = Math.min(M, minimax(T(state, a), alpha, beta));
        if (M <= alpha) {
          return M;
        }
        beta = Math.min(beta, M);
      }
    });
    return M;
  }

  function isComputerTurn() { 
    return (computer === 0 && player === 0) || (computer === 1 && player === 1);
  }

  /**
   * An utility function that returns a utility vector with one entry for each player given a terminal node.
   * 
   * For computer: 
   *  +10 if victory
   *  -10 if defeated
   * 
   * For player: 
   *  -10 if victory
   *  +10 if defeated
   * 
   *  0 if draw.
   * 
   * @param t_s terminal state 
   */
  function U(t_s) {
    // get the last player's entry, not the current player
    const entry = t_s.isComputerTurn ? getPlayerEntry() : getComputerEntry();
    if (stateCheckRows(t_s, entry) || stateCheckCols(t_s, entry) || stateCheckDiags(t_s, entry)) {
      return t_s.isComputerTurn ? -10 : 10;
    } 
    return 0;
  }

  function currState() {
    const s = {
      board: [],
      isComputerTurn: isComputerTurn(),
    };
    for (let i = 0; i < BOARD_SIZE; i++) {
      s.board.push([]);
      Board.getChildrenOnRow(i).forEach(child => s.board[i].push(child.textContent));
    }
    return s;
  }

  function isTerminal(state) {
    // get the last player's entry, not the current player
    const entry = state.isComputerTurn ? getPlayerEntry() : getComputerEntry();
    if (stateCheckRows(state, entry) || stateCheckCols(state, entry) || stateCheckDiags(state, entry)) {
      return true;
    }

    // check for draws
    for (let i=0; i<BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (state.board[i][j] === '') {
          return false;
        }
      }
    }
    return true;
  }
  
  function stateCheckRows(state, entry) {
    return state.board.some(row => row.every(cell => cell === entry));
  }

  function stateCheckCols(state, entry) {
    let n_entry = 0;
    for (let i=0; i<BOARD_SIZE; i++) {
      n_entry = 0;
      for (let j=0; j<BOARD_SIZE; j++) {
        if (state.board[j][i] === entry) {
          n_entry++;
        }
      }
      if (n_entry === BOARD_SIZE) {
        return true;
      }
    } 
    return false;
  }

  function stateCheckDiags(state, entry) {
    const diags = [[], []];
    for (let i = 0; i < BOARD_SIZE; i++) {
      diags[0].push(state.board[i][i]);
      diags[1].push(state.board[i][BOARD_SIZE-1-i]);
    }

    return diags.some(diag => diag.every(cell => cell === entry));
  }

  /**
   * An action function that returns a set of possible 
   * actions that the computer can take at a given state.
   * 
   * An action: [row, col]
   */
  function A(state) {
    const actions = [];
    for (let i=0; i<BOARD_SIZE; i++) {
      for (let j=0; j<BOARD_SIZE; j++) {
        if (state.board[i][j] === '') {
          actions.push([i, j]);
        }
      }
    }
    return actions;
  }

  /**
   * A transition function that returns a deep copy of the next state 
   * after performing the given action with an appropriate entry.
   */
  function T(state, action) {
    const copy_state = JSON.parse(JSON.stringify(state));
    const [row, col] = action;
    copy_state.board[row][col] = state.isComputerTurn ? getComputerEntry() : getPlayerEntry();
    copy_state.isComputerTurn = !copy_state.isComputerTurn;
    return copy_state;
  }

  return {
    playGame,
  }
})();

export default TicTacToe;