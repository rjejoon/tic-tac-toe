import Board from './components/board/board';
import Narration from './components/narration/narration';


const TicTacToe = (function() {
  'use strict';

  const MAX_PLAYER = 2;
  const BOARD_SIZE = 3;
  const bodyEle = document.querySelector("body");

  let player = 0;
  let computer = 1;   // default: computer is player === 1
  // mode === 0: 2 player
  // mode === 1: easy computer
  // mode === 2: hard computer
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
    Board.enableCellsOnClickListener(boardEntryOnClickListener);
  }

  /**
   * An event listener that contains a logic of the 2-player version of Tic Tac Toe.
   * It must be attached to all children of the board.
   */
  function boardEntryOnClickListener(e) {
    const row = this.dataset.row;
    const col = this.dataset.col;
    if (isValidPlay(row, col)) {
      Board.setEntry(row, col, getPlayerEntry());
      Board.removeCellOnClickListener(row, col, boardEntryOnClickListener);

      if (hasWon(getPlayerEntry())) {
        Narration.setTextContent(`Congratulations player ${player+1}! You won!`);
        Board.removeCellsOnClickListerners(boardEntryOnClickListener);
      } else if (isFull(Board.getBoard())) {
        Narration.setTextContent("It's a draw.");
        Board.removeCellsOnClickListerners(boardEntryOnClickListener);
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
    Board.removeCellsOnClickListerners(boardEntryOnClickListener);

    // randomly select row and col
    let row, col;
    do {
      row = Math.floor(Math.random() * BOARD_SIZE);
      col = Math.floor(Math.random() * BOARD_SIZE);
    } while (!isValidPlay(row, col));

    Board.setEntry(row, col, getComputerEntry());
    if (hasWon(getComputerEntry())) {
      Narration.setTextContent(`Computer won!`);
      Board.removeCellsOnClickListerners(boardEntryOnClickListener);
    } else if (isFull(Board.getBoard())) {
      Narration.setTextContent("It's a draw.");
      Board.removeCellsOnClickListerners(boardEntryOnClickListener);
    }
    else {
      changePlayer();
      Board.enableCellsOnClickListener(boardEntryOnClickListener, true);
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
  function hasWon(playerEntry) {
    const board = Board.getBoard();
    return checkCols(board, playerEntry) || checkRows(board, playerEntry) || checkDiags(board, playerEntry);
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
  function checkRows(board, entry) {
    return board.some(row => row.every(cell => cell === entry));
  }

  /**
   * Returns true if any columns of the board is filled with the given entry.
   * @param entry 
   * @returns boolean
   */
  function checkCols(board, entry) {
    let n_entry = 0;
    for (let i=0; i<BOARD_SIZE; i++) {
      n_entry = 0;
      for (let j=0; j<BOARD_SIZE; j++) {
        if (board[j][i] === entry) {
          n_entry++;
        }
      }
      if (n_entry === BOARD_SIZE) {
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
  function checkDiags(board, entry) {
    const diagonals = [[], []];
    for (let i=0; i<BOARD_SIZE; i++) {
      diagonals[0].push(board[i][i]);
      diagonals[1].push(board[i][BOARD_SIZE-1-i]);
    }
    return diagonals.some(diag => diag.every(cell => cell === entry));
  }
  
  /**
   * Returns true if the board is full.
   * @returns {boolean}
   */
  function isFull(board) {
    return board.every(row => row.every(cell => cell !== ''));
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
    return Board.getEntry(row, col) === '';
  }

  function hardComp() { 
    Narration.setTextContent('Computer is choosing...');
    Board.removeCellsOnClickListerners(boardEntryOnClickListener);

    // find the best action for the computer
    // a pair: [action, action_value]
    const actionValuePairs = A(currState()).map(a => [a, minimax(T(currState(), a))]);
    let bestPair = actionValuePairs[0];
    actionValuePairs.forEach(pair => {
      if (pair[1] > bestPair[1]) {
        bestPair = pair;
      }
    })

    let [row, col] = bestPair[0];

    Board.setEntry(row, col, getComputerEntry());
    if (hasWon(getComputerEntry())) {
      Narration.setTextContent(`Computer won!`);
      Board.removeCellsOnClickListerners(boardEntryOnClickListener);
    } else if (isFull(Board.getBoard())) {
      Narration.setTextContent("It's a draw.");
      Board.removeCellsOnClickListerners(boardEntryOnClickListener);
    }
    else {
      changePlayer();
      Board.enableCellsOnClickListener(boardEntryOnClickListener, true);
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
    if (checkRows(t_s.board, entry) || checkCols(t_s.board, entry) || checkDiags(t_s.board, entry)) {
      return t_s.isComputerTurn ? -10 : 10;
    } 
    return 0;
  }

  function currState() {
    return {
      board: Board.getBoard(),
      isComputerTurn: isComputerTurn(),
    };
  }

  function isTerminal(state) {
    // get the last player's entry, not the current player
    const entry = state.isComputerTurn ? getPlayerEntry() : getComputerEntry();
    if (checkRows(state.board, entry) || checkCols(state.board, entry) || checkDiags(state.board, entry)) {
      return true;
    }
    return isFull(state.board);
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