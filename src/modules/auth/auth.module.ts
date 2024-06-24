import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { redisConfig } from 'src/configs/redis.config';
import { UserModule } from 'src/modules/user/user.module';
import { UserAtStrategy } from './strategies/user-at.strategy';
import { UserRtStrategy } from './strategies/user-rt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, UserAtStrategy, UserRtStrategy],
})
export class AuthModule {}
