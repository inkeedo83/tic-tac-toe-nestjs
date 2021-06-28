import { Socket } from 'socket.io';
import { room } from '../types';

export class Rooms {
  private rooms: room[] = [];

  joinRoom(player: Socket): room {
    if (this.isEmpty()) {
      const newRoom = {} as room;
      newRoom.player1 = player;
      this.rooms.push(newRoom);
      console.log('create new room');
      return newRoom;
    }
    for (const i in this.rooms) {
      if (this.rooms[i].gameId === undefined) {
        this.rooms[i].player2 = player;
        console.log('joined to room');
        //ready to start game
        this.rooms[i].gameId = this.generateGameId();
        return this.rooms[i];
      } else if (Number(i) + 1 === this.rooms.length) {
        //error for 3rd user
        return undefined;
      }
    }
  }

  leftRoom(playerId: string): (string | Socket)[] {
    for (const i in this.rooms) {
      if (this.rooms[i].player1.id === playerId) {
        const { player2, gameId } = this.rooms[i];
        this.rooms.splice(Number(i), 1);
        console.log('room destroyed');
        return [player2, gameId];
      } else if (this.rooms[i].player2.id === playerId) {
        const { player1, gameId } = this.rooms[i];
        this.rooms.splice(Number(i), 1);
        console.log('room destroyed');
        return [player1, gameId];
      }
    }

    return undefined;
  }

  private isEmpty(): boolean {
    return this.rooms.length === 0;
  }

  private generateGameId(): string {
    return Math.random().toString(36).substring(2);
  }

  getByClient(clientId: string): room {
    const index = this.rooms.findIndex(
      (room) => room.player1.id === clientId || room.player2.id === clientId,
    );
    return this.rooms[index];
  }
}
