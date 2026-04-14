import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketsService {
  private server!: Server;

  setServer(server: Server) {
    this.server = server;
  }

  getServer(): Server {
    if (!this.server) {
      throw new Error('Socket server not initialized');
    }
    return this.server;
  }
}
