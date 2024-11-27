import * as dotenv from 'dotenv';
dotenv.config();
import { join } from 'path';
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

const { name, port, prefix, node_env, sentry_dns } = config.get<any>('app');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModules, {
    cors: true,
  });
  Sentry.init({
    dsn: sentry_dns,
    environment: node_env,
  });
  app.enableCors({});
  app.use(helmet());
  app.use(compression());
  app.enableShutdownHooks();
  app.setGlobalPrefix(prefix);
  app.use(json({ limit: '50mb' }));
  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalPipes(new BodyValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SentryInterceptor());
  app.enableVersioning({ type: VersioningType.URI });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(name)
    .setVersion('0.0.1')
    .setDescription(`${name} description`)
    .setExternalDoc('Postman Collection', `/${prefix}/docs-json`)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${prefix}/docs`, app, document, {
    customSiteTitle: name,
    swaggerUiEnabled: true,
    swaggerOptions: {
      filter: true,
      deepLinking: true,
      docExpansion: 'list',
      persistAuthorization: true,
      displayRequestDuration: true,
      defaultModelsExpandDepth: -1,
    },
  });
  await app.listen(port).then(async () => {
    const logger = app.get(Logger);
    logger.debug(
      `Application is running on: ${await app.getUrl()}/${prefix}/docs/#/`,
    );
  });
}
bootstrap();
