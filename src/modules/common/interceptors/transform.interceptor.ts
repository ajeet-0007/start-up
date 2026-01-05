import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PaginationDto } from '../dtos/pagination.dto';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  error: boolean;
  value: T;
  pagination?: PaginationDto;
  messages?: string[];
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (!data?.pagination && !Array.isArray(data)) {
          return {
            error: false,
            value: data,
            messages: [] as string[],
          };
        }
        return {
          error: false,
          value: data.value,
          messages: [] as string[],
        };
      }),
    );
  }
}
