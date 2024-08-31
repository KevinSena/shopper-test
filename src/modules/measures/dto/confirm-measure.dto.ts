import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class ConfirmMeasureDto {
  @IsNotEmpty()
  @IsUUID()
  readonly measure_uuid: string;

  @IsNotEmpty()
  @IsInt()
  readonly confirmed_value: number;
}
