import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;
    const now = Date.now();

    console.log(`\n[${new Date().toISOString()}] ${method} ${url}`);
    if (body && Object.keys(body).length > 0) {
      console.log('Request Body:', JSON.stringify(body, null, 2));
    }
    if (headers.authorization) {
      console.log('Authorization: Bearer ***');
    }

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const delay = Date.now() - now;
        console.log(
          `[${new Date().toISOString()}] ${method} ${url} - ${statusCode} (${delay}ms)\n`,
        );
      }),
    );
  }
}

