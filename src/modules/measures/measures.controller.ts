import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
} from '@nestjs/common';
import { MeasuresService } from './measures.service';
import { UploadMeasureDto } from './dto/create-measures.dto';
import { ConfirmMeasureDto } from './dto/confirm-measure.dto';

@Controller()
export class MeasuresController {
  constructor(private readonly measuresService: MeasuresService) {}

  @Post('/upload')
  async uploadMeasure(@Body() uploadMeasuresDto: UploadMeasureDto) {
    const { measure_type } = uploadMeasuresDto;
    const validMeasureTypes = ['WATER', 'GAS'];
    if (!validMeasureTypes.includes(measure_type.toUpperCase())) {
      throw new BadRequestException('Invalid measure type.');
    }

    const result = await this.measuresService.upload(uploadMeasuresDto);

    return {
      image_url: result.image_url,
      measure_value: result.measure_value,
      measure_uuid: result.measure_uuid,
    };
  }

  @Patch('/confirm')
  async confirmMeasure(@Body() confirmMeasureDto: ConfirmMeasureDto) {
    await this.measuresService.confirm(confirmMeasureDto);
    return {
      success: true,
    };
  }
}
