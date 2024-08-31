import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UploadMeasureDto {
  @IsNotEmpty()
  @IsString()
  readonly image: string;

  @IsNotEmpty()
  readonly customer_code: string;

  @IsNotEmpty()
  @IsDateString()
  readonly measure_datetime: Date;

  @IsNotEmpty()
  @IsString()
  readonly measure_type: string;
}
