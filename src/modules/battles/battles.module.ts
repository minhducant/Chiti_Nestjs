import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import { BattlesService } from './battles.service';
import { BattlesGateway } from './battles.gateway';
import { redisConfig } from 'src/configs/redis.config';
import { BattlesController } from './battles.controller';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Battles, BattlesSchema } from './schemas/battles.schema';
import { WaitingRoom, WaitingRoomSchema } from './schemas/waiting-room.schema';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Battles.name, schema: BattlesSchema },
      { name: WaitingRoom.name, schema: WaitingRoomSchema },
    ]),
  ],
  exports: [BattlesService],
  providers: [BattlesService, BattlesGateway],
  controllers: [BattlesController],
})
export class BattlesModule {}
