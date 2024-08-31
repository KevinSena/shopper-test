import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
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

  @Get('/:id/list')
  async listMeasures(
    @Param('id') id: string,
    @Query('measure_type') measure_type?: string,
  ) {
    const validMeasureTypes = ['WATER', 'GAS'];
    if (
      typeof measure_type === 'string' &&
      !validMeasureTypes.includes(measure_type.toUpperCase())
    ) {
      throw new HttpException(
        {
          error_code: 'INVALID_TYPE',
          error_description: 'Tipo de medição não permitida',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.measuresService.list(id, measure_type);
  }
}
