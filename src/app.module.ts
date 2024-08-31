import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as process from 'node:process';
import { MeasuresModule } from './modules/measures/measures.module';

console.log(
  process.env.MONGO_INITDB_ROOT_PASSWORD,
  process.env.MONGO_INITDB_ROOT_USERNAME,
);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
      authSource: 'admin',
    }),
    MeasuresModule,
  ],
})
export class AppModule {}
