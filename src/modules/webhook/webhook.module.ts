import { Module } from '@nestjs/common';
import { WebhookService } from './services/webhook/webhook.service';
import { WebhookController } from './controllers/webhook/webhook.controller';
import { WebhookListener } from './listeners/webhook.listener';
import { CqrsModule } from '@nestjs/cqrs';
import { WebhookRepository } from './repositories/webhook.repository';
import { WebhookSchema } from './schemas/webhook.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhookHistoriesService } from './services/webhook-histories/webhook-histories.service';
import { WebhookHistoryRepository } from './repositories/webhook-histories.repository';
import { WebhookHistorySchema } from './schemas/webhook-histories.schema';
// import { HttpModule } from '@nestjs/axios';
import { WebhookHttpModule } from '../http/http.module';
// import { HttpModule } from '../http/http.module';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: 'Webhook', schema: WebhookSchema },
      { name: 'WebhookHistory', schema: WebhookHistorySchema },
    ]),
    WebhookHttpModule
  ],
  providers: [
    WebhookService,
    WebhookListener,
    WebhookRepository,
    WebhookHistoriesService,
    WebhookHistoryRepository
  ],
  exports: [WebhookService, WebhookListener, WebhookHistoriesService],
  controllers: [WebhookController],
})
export class WebhookModule {}
