import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine status code
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract error message and error name
    let message = (
      isHttpException
        ? (exception.getResponse() as any)?.message || exception.message
        : (exception as Error).message
    ) as string | string[];

    // If class-validator sent an array of errors, flatten it
    if (Array.isArray(message)) {
      message = (message as string[]).join('; ');
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message || 'Internal server error',
      error: isHttpException
        ? (exception as HttpException).name
        : HttpStatus[status as unknown as keyof typeof HttpStatus],
      // Include stack trace in development only
      ...(process.env.NODE_ENV === 'development' && {
        stack: (exception as Error).stack,
      }),
    };

    // Log full exception
    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
      (exception as Error).stack,
    );

    response.status(status).json(errorResponse);
  }
}
