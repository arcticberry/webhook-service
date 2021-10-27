import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    Logger,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        let ctx = context.switchToRpc()
        Logger.log(`AUTHSERVICE:::time: ${new Date().toLocaleString()} command: ${ctx.getContext().args[2]} payload: ${JSON.stringify(ctx.getData())} `, context.getClass.name) 
        return next.handle()
      }
  }