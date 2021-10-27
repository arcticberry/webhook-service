import { BadRequestException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { AllExceptionsFilter } from './shared/filters/rcp.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { EventModule } from './modules/event/event.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import ValidationPipe from './shared/pipes/classValidation.pipe';
import { CqrsModule } from '@nestjs/cqrs';
import { WebhookController } from './modules/webhook/controllers/webhook/webhook.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhookHttpModule } from './modules/http/http.module';



@Module({
  imports: [CqrsModule, MongooseModule.forRoot(process.env.MONGO_URL_WEBHOOK), ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration]
  }), EventModule, WebhookModule, WebhookHttpModule],
  controllers: [AppController],
  providers: [
    {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  },
  { 
    provide: APP_PIPE,
    useFactory: () => {
      return new ValidationPipe({
        exceptionFactory: (errors) => new BadRequestException(errors),
        transform: true,
        validationError: {target: false, value: false},
        whitelist: true
      })
      
    }
  },AppService],
})
export class AppModule {}
