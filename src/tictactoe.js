import Board from './Board';


const TicTacToe = (function() {
  'use strict';

  let player = 0;

  function playGame() {
    Board.initBoard();
    while (true) {
      const [row, col] = prompt(`Player ${player+1}'s turn!`).split(' ');
      if (!Board.playTurn(row, col, getPlayerEntry())) {
        console.log('Invalid entry!');
        continue;
      }
      Board.printBoard();
      if (isGameOver()) {
        console.log(`Congratulations player ${player+1}! You won!`);
        return;
      }
      changePlayer();
    }
  }


  function isGameOver() {
    const entry = getPlayerEntry();
    return Board.checkCols(entry) || Board.checkRows(entry) || Board.checkDiags(entry);
  }

  function changePlayer() {
    player = (player + 1) % 2;
  }

  function getPlayerEntry() {
    return (player === 0) ? 'O' : 'X';
  }
  
  return {
    playGame,
  }
})();

export default TicTacToe;