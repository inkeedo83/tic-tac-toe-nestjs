import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { socketStrings } from 'src/common/constants';
import { Games, Players, Rooms } from '../common/classes';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer() server: Server;
  players = new Players();
  rooms = new Rooms();
  games = new Games();

  private logger: Logger = new Logger('AppGateway');
  afterInit() {
    this.logger.log(`server: Initialized`);
  }

  handleConnection(client: Socket): void {
    this.logger.log(`${client.id} connected`);
    client.emit(socketStrings.WELCOME, client.id);
    // register player
    // create room if he is first in room.
    // or join to room and start game
    this.main(client);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`${client.id} disconnected`);
    // remove player
    // destroy room and game if exist
    this.players.playerLeft(client);
    const res = this.rooms.leftRoom(client.id);
    if (res !== undefined) {
      const gameId = res[1] as string;
      this.games.destroy(gameId);
      const pl = res[0] as Socket;
      if (pl !== undefined) this.players.playerLeft(pl);
    }
  }

  main(client: Socket): void {
    this.players.playerJoined(client);
    const room = this.rooms.joinRoom(client);
    // if room contains player1 & player2 & game ID, then start game
    if (room === undefined) {
      // console.log('error, no free games');
      client.emit(socketStrings.ERROR, socketStrings.NOFREEGAMES);
    } else if (room.gameId !== undefined) {
      this.logger.log(
        `game start for players ${room.player1.id} and ${room.player2.id}`,
      );
      // ame data
      const game = this.games.new(room);
      // players sockets to emmit data
      room.player1.emit(socketStrings.GAMEBEGIN, game);
      room.player2.emit(socketStrings.GAMEBEGIN, game);
    }
  }

  @SubscribeMessage(socketStrings.MAKEMOVE)
  handleMessage(client: Socket, position: number): void {
    const { player1, player2, gameId } = this.rooms.getByClient(client.id);
    const game = this.games.checkGame(client.id, gameId, position);
    player1.emit(socketStrings.MOVEMADE, game);
    player2.emit(socketStrings.MOVEMADE, game);
  }
}
