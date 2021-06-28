import { game, player, room } from 'src/common/types';
import { gameStrings, PLAYER1, PLAYER2, winStates } from '../constants';

export class Games {
  private games = new Map<string, game>();

  public new(roomData: room): game {
    const { player1, player2, gameId } = roomData;
    const player1Obj = {} as player;
    const player2Obj = {} as player;
    const newGame = {} as game;

    player1Obj.id = player1.id;
    player1Obj.symbol = gameStrings.X;
    player1Obj.message = gameStrings.YOUR_TURN;
    player1Obj.error = '';
    player2Obj.id = player2.id;
    player2Obj.symbol = gameStrings.O;
    player2Obj.message = gameStrings.OPPONNENT_TURN;
    player2Obj.error = '';

    newGame.gameid = gameId;
    newGame.board = new Array(9).fill(null);
    newGame.player1 = player1Obj;
    newGame.player2 = player2Obj;
    newGame.turn = player1Obj.id;
    newGame.result = gameStrings.NONE;
    newGame.error = '';
    newGame.movesCounter = 0;

    this.games.set(newGame.gameid, newGame);
    return newGame;
  }

  public checkGame(playerId: string, gameId: string, positon: number): game {
    const game = this.games.get(gameId);

    //if game over keep idle
    if (game.result === gameStrings.GAMEOVER) {
      return game;
    }

    const [player, opponent] = this.getPlayerAndOpponent(playerId, gameId);

    // not player's move
    if (game.turn !== playerId) {
      game[player].error = gameStrings.NOT_YOUR_TURN;
      this.games.set(gameId, game);
      return game;
    }

    // invalid move
    const cell = game.board[positon];

    if (cell !== null) {
      game[player].error = gameStrings.INVALID;
      this.games.set(gameId, game);
      return game;
    }

    // count the move
    game.movesCounter++;

    //update boared
    game.board[positon] = game[player].symbol;
    // check if player win after move
    const isWinner = this.checkWinner(game.board, game[player].symbol);
    if (isWinner) {
      game.result = gameStrings.GAMEOVER;
      game[player].message = gameStrings.WIN;
      game[opponent].message = gameStrings.LOST;
    } else if (game.movesCounter === 9) {
      game[player].message = gameStrings.DRAW;
      game[opponent].message = gameStrings.DRAW;
      game.result = gameStrings.GAMEOVER;
    } else {
      game[player].message = gameStrings.OPPONNENT_TURN;
      game[opponent].message = gameStrings.YOUR_TURN;
      game.turn = game[opponent].id;
    }
    game[player].error = '';
    game[opponent].error = '';
    this.games.set(gameId, game);
    // return game;
    return this.games.get(gameId);
  }

  public destroy(gameId: string): void {
    this.games.delete(gameId);
  }

  private checkWinner(board: string[], symbol: string): boolean {
    return winStates.some((state) =>
      state.every((position) => board[position] === symbol),
    );
  }

  getPlayerAndOpponent(playerId: string, gameId: string): string[] {
    const game = this.games.get(gameId);
    if (playerId === game.player1.id) return [PLAYER1, PLAYER2];
    if (playerId === game.player2.id) return [PLAYER2, PLAYER1];
  }
}
