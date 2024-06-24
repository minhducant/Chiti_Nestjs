import * as dotenv from 'dotenv';
dotenv.config();
import * as config from 'config';
import * as helmet from 'helmet';
import * as Sentry from '@sentry/node';
import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';
import { urlencoded, json } from 'express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Logger, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModules } from 'src/app.module';
import { BodyValidationPipe } from 'src/shares/pipes/body.validation.pipe';
import { HttpExceptionFilter } from 'src/shares/filters/http-exception.filter';
import { SentryInterceptor } from 'src/shares/interceptors/sentry.interceptor';
import { ResponseTransformInterceptor } from 'src/shares/interceptors/response.interceptor';

const appPort = config.get<number>('app.port');
const prefix = config.get<string>('app.prefix');
const appEnv = config.get<string>('app.node_env');
const dnsSentry = config.get<string>('sentry_dns');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModules, {
    cors: true,
  });
  Sentry.init({
    dsn: dnsSentry,
    environment: appEnv,
  });
  app.use(helmet());
  app.use(compression());
  app.setGlobalPrefix(prefix);
  app.enableCors({ origin: '*' });
  app.use(json({ limit: '50mb' }));
  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalPipes(new BodyValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SentryInterceptor());
  app.enableVersioning({ type: VersioningType.URI });
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  const appName = config.get<string>('app.name');
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(appName)
    .setVersion('0.0.1')
    .setDescription(`${appName} description`)
    .setExternalDoc('Postman Collection', `/${prefix}/docs-json`)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${prefix}/docs`, app, document, {
    customSiteTitle: appName,
    swaggerOptions: {
      filter: true,
      deepLinking: true,
      docExpansion: 'list',
      persistAuthorization: true,
      displayRequestDuration: true,
      defaultModelsExpandDepth: -1,
    },
  });
  await app.listen(appPort).then(async () => {
    const logger = app.get(Logger);
    logger.debug(
      `Application is running on: ${await app.getUrl()}/${prefix}/docs/#/`,
    );
  });
}
bootstrap();
