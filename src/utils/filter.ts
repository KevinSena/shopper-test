import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.BAD_REQUEST;

    const errorResponse = exception.getResponse();
    let errorDescription = 'Invalid request data';

    if (typeof errorResponse === 'object' && errorResponse !== null) {
      if ((errorResponse as any).message) {
        errorDescription = (errorResponse as any).message;
      } else if ((errorResponse as any).error) {
        errorDescription = (errorResponse as any).error;
      }
    }

    response.status(status).json({
      error_code: 'INVALID_DATA',
      error_description: errorDescription,
    });
  }
}
