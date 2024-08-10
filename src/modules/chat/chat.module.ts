import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { ChatService } from './chat.service';
import { UserModule } from '../user/user.module';
import { ChatController } from './chat.controller';
import { redisConfig } from 'src/configs/redis.config';
import { Note, NoteSchema } from '../note/schemas/note.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import {
  Notification,
  NotificationSchema,
} from '../notification/schemas/notification.schema';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    UserModule,
    NotificationModule,
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
    MongooseModule.forFeature([
      { name: Note.name, schema: NoteSchema },
      { name: User.name, schema: UserSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  exports: [ChatService],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
