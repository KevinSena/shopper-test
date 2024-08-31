import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Measure, Measures } from './measures.schema';
import { Model } from 'mongoose';
import { UploadMeasureDto } from './dto/create-measures.dto';
import { v4 } from 'uuid';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MeasuresService {
  constructor(
    @InjectModel(Measures.name) private readonly measuresModel: Model<Measures>,
  ) {}

  async upload(uploadMeasureDto: UploadMeasureDto): Promise<Measure> {
    const { image } = uploadMeasureDto;
    const matches = image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);

    if (!matches) {
      throw new HttpException(
        {
          error_code: 'INVALID_DATA',
          error_description: 'Formato de imagem inválida',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const customer_measures = await this.measuresModel.findOne({
      customer_code: uploadMeasureDto.customer_code,
    });
    const newDate = new Date(uploadMeasureDto.measure_datetime);
    if (customer_measures) {
      const monthMeasured = customer_measures.measures.find(
        (e) =>
          e.measure_datetime.getMonth() === newDate.getMonth() &&
          e.measure_type.toUpperCase() === e.measure_type.toUpperCase(),
      );
      if (monthMeasured) {
        throw new HttpException(
          {
            error_code: 'DOUBLE_REPORT',
            error_description: 'Leitura do mês já realizada',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    const pathdir = path.join(__dirname, '../../static');
    if (!fs.existsSync(pathdir)) {
      fs.mkdirSync(pathdir, { recursive: true });
    }
    const ext = matches[1];
    const filename = `${v4()}.${ext}`;
    const filePath = path.join(pathdir, filename);
    try {
      fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to save the image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: `image/${ext}`,
      name: v4(),
    });
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      // Choose a Gemini model.
      model: 'gemini-1.5-flash',
    });
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      {
        text: 'extract the meter reading displayed in the image, return just number',
      },
    ]);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Erro ao remover o arquivo ${filename}:`, err);
        return;
      }
    });

    const createdMeasure = await this.measuresModel.create({
      customer_code: uploadMeasureDto.customer_code,
      measures: {
        measure_uuid: v4(),
        measure_datetime: uploadMeasureDto.measure_datetime,
        measure_type: uploadMeasureDto.measure_type,
        image_url: uploadResponse.file.uri,
        measure_value: Number(result.response.text()),
      },
    });

    return createdMeasure.measures.pop();
  }
}
