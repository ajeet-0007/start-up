import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
  HttpException,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CustomException } from './custom-exception';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();
      message = message = (response as any)['message'] || response;
    }
    if (exception instanceof CustomException) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = [exception.message]; // Set custom error code in the headers
      const customCode = exception.code.toString().slice(-3);
      httpStatus = Number(customCode);
    }
    try {
      const request = ctx.getRequest();
      this.logger.error(
        request.originalUrl,
        {
          body: request?.body,
          headers: request?.headers,
          params: request?.params,
          query: request?.query,
          user: request?.user,
          exception,
        },
        'ApplicationError',
      );
    } catch (err) {
      this.logger.error(message, exception);
    }
    const responseBody = {
      error: true,
      messages: message,
      value:
        process.env.NODE_ENV === 'development'
          ? {
              method: httpAdapter.getRequestMethod(ctx.getRequest()),
              timestamp: new Date().toISOString(),
              path: httpAdapter.getRequestUrl(ctx.getRequest()),
              exception: exception,
            }
          : {},
    };
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
