import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const token = socket.handshake.query.token as string;
      if (!token) {
        socket.disconnect();
        console.log('Desconectado: Token no proporcionado');
        return;
      }

      const payload = this.chatService.onClientConnected({
        id: socket.id,
        token,
      });

      // Emitir la lista de usuarios conectados cuando alguien se conecta
      this.server.emit('clients-changed', this.chatService.getClients());

      socket.on('disconnect', () => {
        // Eliminar al cliente de la lista cuando se desconecta
        this.chatService.onClientDisconnected(socket.id);
        this.server.emit('clients-changed', this.chatService.getClients()); // Emitir la lista actualizada de usuarios
      });

      socket.on('message', (message) => {
        const formattedMessage = this.chatService.onClientMessage(message);
        this.server.emit('message', formattedMessage); // Emitir el mensaje a todos los clientes
      });
    });
  }
}
