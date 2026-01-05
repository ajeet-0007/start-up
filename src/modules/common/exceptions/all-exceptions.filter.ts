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
    const request = ctx.getRequest();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] | object = 'Internal server error';
    let responseBody: any = null;

    /** ───────────── HttpException ───────────── */
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      responseBody = exception.getResponse();
      message =
        (responseBody as any)?.message ?? responseBody ?? exception.message;
    } else if (exception instanceof CustomException) {
      /** ───────────── CustomException ───────────── */
      httpStatus =
        Number(exception.code?.toString().slice(-3)) || HttpStatus.BAD_REQUEST;

      message = [exception.message];
    }

    /** ───────────── Winston Safe Logging ───────────── */
    try {
      this.logger.error(
        request?.originalUrl || request?.url,
        {
          body: request?.body,
          headers: request?.headers,
          params: request?.params,
          query: request?.query,
          user: request?.user,
          exception: {
            name: exception?.name,
            message: exception?.message,
            stack: exception?.stack,
            status: httpStatus,
            response: responseBody,
          },
        },
        'ApplicationError',
      );
    } catch (logError) {
      this.logger.error('Failed to log exception', logError);
    }

    /** ───────────── Client Response ───────────── */
    const response = {
      error: true,
      messages: message,
      value:
        process.env.NODE_ENV === 'development'
          ? {
              method: httpAdapter.getRequestMethod(request),
              timestamp: new Date().toISOString(),
              path: httpAdapter.getRequestUrl(request),
              exception: {
                name: exception?.name,
                message: exception?.message,
                stack: exception?.stack,
              },
            }
          : {},
    };

    httpAdapter.reply(ctx.getResponse(), response, httpStatus);
  }
}
