import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import * as functions from 'firebase-functions';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModules } from './src/app.module';

const expressServer = express();

const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModules,
    new ExpressAdapter(expressInstance),
  );
  await app.init();
};

export const api = functions.https.onRequest(async (request, response) => {
  await createFunction(expressServer);
  expressServer(request, response);
});
