import { Socket } from 'socket.io';

export type player = {
  id: string;
  symbol: string;
  message: string;
  error: string;
};
export type game = {
  gameid: string;
  player1: player;
  player2: player;
  turn: string;
  board: string[];
  result: string;
  error: string;
  movesCounter: number;
};

export type room = {
  player1: Socket;
  player2: Socket;
  gameId: string;
};
