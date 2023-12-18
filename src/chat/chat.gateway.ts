import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private adminSocket: Socket | null = null;
  private clients: Map<string, Socket> = new Map();

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): void {
  //   console.log(payload);
  //   this.server.emit('message', payload); // Broadcast message to all connected clients
  // }

  @SubscribeMessage('connectAdmin')
  handleAdminConnection(@ConnectedSocket() client: Socket): string {
    console.log('Admin connected');
    this.adminSocket = client;
    return 'Admin connected';
  }

  @SubscribeMessage('connectClient')
  handleClientConnection(
    @MessageBody() clientId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.clients.set(clientId, client);
  }

  @SubscribeMessage('sendMessageToAdmin')
  handleMessageToAdmin(
    @MessageBody() data: { clientId: string; message: string },
  ): void {
    console.log('Received message for admin:', data);
    if (this.adminSocket) {
      console.log('Forwarding message to admin:', data);
      this.adminSocket.emit('messageFromClient', data);
    } else {
      console.log('Admin is not connected');
    }
  }

  @SubscribeMessage('sendMessageToClient')
  handleMessageToClient(
    @MessageBody() data: { clientId: string; message: string },
  ): void {
    const client = this.clients.get(data.clientId);
    if (client) {
      client.emit('messageFromAdmin', data.message);
    }
  }

  handleDisconnect(client: Socket): void {
    if (this.adminSocket === client) {
      this.adminSocket = null;
      console.log('Admin disconnected');
    } else {
      this.clients.forEach((value, key) => {
        if (value === client) {
          this.clients.delete(key);
          console.log(`Client ${key} disconnected`);
        }
      });
    }
  }
}
