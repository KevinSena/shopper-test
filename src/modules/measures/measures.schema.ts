import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MeasureDocument = HydratedDocument<Measures>;

@Schema()
export class Measure {
  @Prop()
  measure_uuid: string;

  @Prop()
  measure_datetime: Date;

  @Prop()
  measure_type: string;

  @Prop()
  image_url: string;

  @Prop()
  measure_value: number;

  @Prop()
  has_confirmed: boolean;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

@Schema()
export class Measures {
  @Prop()
  customer_code: string;

  @Prop([Measure])
  measures: Measure[];
}

export const MeasuresSchema = SchemaFactory.createForClass(Measures);
