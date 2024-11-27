import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { ConsoleModule } from 'nestjs-console';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import * as redisStore from 'cache-manager-redis-store';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { mongodb } from 'src/configs/database.config';
import { redisConfig } from 'src/configs/redis.config';
//Customer Module
import { NoteModule } from 'src/modules/note/note.module';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { DebtModule } from 'src/modules/debt/debt.module';
import { ChatModule } from 'src/modules/chat/chat.module';
import { ToolModule } from 'src/modules/tool/tool.module';
import { InviteModule } from 'src/modules/invite/invite.module';
import { FriendModule } from 'src/modules/friend/friend.module';
import { BattlesModule } from 'src/modules/battles/battles.module';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { NotificationModule } from 'src/modules/notification/notification.module';

const Modules: any = [
  ConsoleModule,
  ScheduleModule.forRoot(),
  ConfigModule.forRoot({ isGlobal: true }),
  MongooseModule.forRoot(mongodb.uri, mongodb.options),
  ThrottlerModule.forRoot([
    {
      ttl: 60000,
      limit: 10,
    },
  ]),
  BullModule.forRoot({
    redis: redisConfig,
  }),
  CacheModule.register({
    store: redisStore,
    ...redisConfig,
    isGlobal: true,
  }),
  EventEmitterModule.forRoot({
    global: true,
  }),
  //Customer Module
  AuthModule,
  UserModule,
  FriendModule,
  InviteModule,
  NoteModule,
  ChatModule,
  DebtModule,
  PaymentModule,
  NotificationModule,
  // BattlesModule,
  ToolModule,
];
export default Modules;
