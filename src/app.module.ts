import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';

import Modules from 'src/modules';
import { AppController } from './app.controller';
import { LoggerMiddleware } from 'src/shares/middlewares/logger.middleware';
@Module({
  controllers: [],
  imports: [...Modules],
  providers: [Logger, AppController],
})
export class AppModules {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).exclude('/api/v1/ping').forRoutes('/');
  }
}
