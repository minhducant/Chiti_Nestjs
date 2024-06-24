import {
  HttpStatus,
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getConfig } from 'src/configs';

export interface Response<T> {
  data: T;
  metadata: Record<string, unknown>;
}
@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((_data) => {
        const req = context.switchToHttp().getRequest();
        if (!_data) {
          return {
            code: HttpStatus.OK,
            data: null,
            metadata: null,
          };
        }
        const metadata = {
          ..._data.metadata,
        };
        metadata.apiName = getConfig().get<string>('app.name');
        metadata.apiVersion = getConfig().get<string>('app.version');
        metadata.timestamp = new Date();

        if (_data?.data?.length || _data?.length) {
          metadata.length = _data?.data?.length || _data?.length;
        }
        if (req.query) {
          metadata.query = { ...req.query };
        }
        delete _data.metadata;
        return {
          code: HttpStatus.OK,
          data: _data.data || _data,
          metadata: metadata,
        };
      }),
    );
  }
}
