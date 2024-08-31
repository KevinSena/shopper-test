import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { MeasuresService } from './measures.service';
import { UploadMeasureDto } from './dto/create-measures.dto';

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
}
