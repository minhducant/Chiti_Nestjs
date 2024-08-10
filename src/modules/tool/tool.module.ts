import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { redisConfig } from 'src/configs/redis.config';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
  ],
  exports: [ToolService],
  providers: [ToolService],
  controllers: [ToolController]
})
export class ToolModule {}
