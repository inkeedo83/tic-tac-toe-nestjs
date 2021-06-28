import { Socket } from 'socket.io';
export class Players {
  private players = new Map<string, Socket>();

  public playerJoined(player: Socket): Socket {
    this.players.set(player.id, player);
    return player;
  }
  public playerLeft(player: Socket): boolean {
    return this.players.delete(player.id);
  }
  // isEmpty(): boolean {
  //   return this.players.size === 0;
  // }
  // size(): number {
  //   return this.players.size;
  // }
}
