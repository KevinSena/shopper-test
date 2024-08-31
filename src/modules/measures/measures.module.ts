import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Measures, MeasuresSchema } from './measures.schema';
import { MeasuresController } from './measures.controller';
import { MeasuresService } from './measures.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Measures.name, schema: MeasuresSchema },
    ]),
  ],
  controllers: [MeasuresController],
  providers: [MeasuresService],
})
export class MeasuresModule {}
