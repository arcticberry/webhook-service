import { Catch, RpcExceptionFilter, ArgumentsHost, BadRequestException, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { TimeoutError } from 'rxjs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  catch(exception: any, host: ArgumentsHost) {

    const status = exception instanceof HttpException ? exception.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : 'Internal Server Error';
   

    if(exception instanceof TimeoutError ) {

      Logger.error(`Response Code: 503 time: ${new Date().toLocaleDateString(), JSON.stringify({
        status: false,
        statusCode: 503,
        message: "Service Unavailable",
        errors: [],
        timestamp: new Date().toLocaleString(),
      })} \n
      ${JSON.stringify(exception)} `)

      return {
        status: false,
        statusCode: 503,
        message: "Service Unavailable",
        errors: [],
        timestamp: new Date().toLocaleString(),
      };

      
    }

    const response = {
      status: false,
      statusCode: status,
      message: message,
      errors: this.getValidationErrors(exception),
      timestamp: new Date().toLocaleString(),
    };

    Logger.error(`Response Code: ${exception.getStatus()} time: ${new Date().toLocaleDateString(), JSON.stringify(response)} \n
      ${JSON.stringify(exception)} `)


    return throwError(response);
  }

  getValidationErrors(exception: unknown) {
    if(exception instanceof BadRequestException) {
      const message = exception.getResponse();

      if(typeof message === 'object') {
        return (message as any).errors
      }
    }
    return []
  }
}