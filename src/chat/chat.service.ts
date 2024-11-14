import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { client } from './interfaces/client-chat.interface';

@Injectable()
export class ChatService {
  constructor(private jwtService: JwtService) {}
  private clients: Record<string, client> = {};

  getClients() {
    return Object.values(this.clients);
  }

  onClientConnected(client: client) {
    this.clients[client.id] = client;
    const payload = this.jwtService.decode(client.token) as { email: string };
    console.log(`Cliente ${payload.email} conectado`);
    return payload;
  }

  onClientDisconnected(clientId: string) {
    console.log(`Cliente ${clientId} desconectado`);
    delete this.clients[clientId];
  }

  onClientMessage(data: any) {
    console.log(`${data.name}: ${data.message}`);
    return data; // Retorna el mensaje para que se pueda emitir desde el gateway
  }
}
