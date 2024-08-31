import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestExceptionFilter } from './utils/filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new BadRequestExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(3000);
  console.log(`App listening on port http://localhost:3000`);
}
bootstrap();
