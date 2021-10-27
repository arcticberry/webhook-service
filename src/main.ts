import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/rcp.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
     transport: Transport.RMQ,
     options: { 
          urls: [process.env.RABBITMQ_URL],
          queue: process.env.WEBHOOK_QUEUE,
          queueOptions: { 
             durable: false
            },
          },
   });

   app.useGlobalFilters(new AllExceptionsFilter())
  await app.listen();
}
bootstrap();