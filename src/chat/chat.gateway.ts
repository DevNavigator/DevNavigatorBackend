import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import {Server, Socket} from 'socket.io';
@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  public server: Server;
  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const token = socket.handshake.query.token as string;
      if (!token) socket.disconnect(); console.log('Disconnected');
      
      this.server.emit('clients-changed', this.chatService.getClients());
      this.chatService.onClientConnected({id: socket.id, token});

      socket.on('disconnect', () => {
        this.chatService.onClientDisconnected(socket.id);
        this.server.emit('clients-changed', this.chatService.getClients());
      })

      socket.on('message', (message) => {
        this.chatService.onClientMessage(message);
      })
    });
  }
}