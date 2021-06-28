const socketStrings = {
  GAMEBEGIN: 'game.begin',
  MAKEMOVE: 'make.move',
  MOVEMADE: 'move.made',
  WELCOME: 'welcome',
  ERROR: 'error_msg',
  NOFREEGAMES: 'no free games',
};

const winStates = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const PLAYER1 = 'player1';
const PLAYER2 = 'player2';

const gameStrings = {
  GAMEOVER: 'GAME OVER',
  WIN: 'You Win!',
  LOST: 'You lost!',
  DRAW: 'DRAW',
  YOUR_TURN: 'your turn',
  NOT_YOUR_TURN: 'not your turn',
  OPPONNENT_TURN: 'your opponent turn',
  X: 'x',
  O: 'o',
  NONE: 'none',
  INVALID: 'invalid move, try again',
};
export { gameStrings, PLAYER1, PLAYER2, winStates, socketStrings };
