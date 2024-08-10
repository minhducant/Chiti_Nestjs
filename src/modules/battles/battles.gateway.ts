import {
  Injectable,
  UseInterceptors,
  ClassSerializerInterceptor,
  Logger,
} from '@nestjs/common';
import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway({
  namespace: 'game',
  transports: ['websocket'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

@Injectable()
export class BattlesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private activePlayers: Map<string, Socket> = new Map();
  private readonly logger = new Logger(BattlesGateway.name);

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Initialize game state or handle player connection
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.activePlayers.delete(client.id);
    // Update game state, notify other players
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(
    @MessageBody() data: { gameId: string; playerId: string },
    client: Socket,
  ) {
    this.activePlayers.set(client.id, client);
    const { gameId, playerId } = data;
    // Notify other players or perform actions based on gameId
    this.server
      .to(gameId)
      .emit('playerJoined', { playerId, clientId: client.id });
  }

  @SubscribeMessage('makeMove')
  async handleMakeMove(
    @MessageBody() data: { gameId: string; move: any },
    client: Socket,
  ) {
    try {
      const { gameId, move } = data;
      // Handle game move logic
      this.server.to(gameId).emit('playerMoved', { move, clientId: client.id });
    } catch (error) {
      this.logger.error(`Error handling move: ${error.message}`);
    }
  }

  @SubscribeMessage('endGame')
  async handleEndGame(@MessageBody() data: { gameId: string }, client: Socket) {
    try {
      const { gameId } = data;
      // Handle game end logic
      this.server
        .to(gameId)
        .emit('gameEnded', { message: 'The game has ended' });
    } catch (error) {
      this.logger.error(`Error ending game: ${error.message}`);
    }
  }
}
