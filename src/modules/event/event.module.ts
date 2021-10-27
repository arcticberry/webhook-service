import { Module } from '@nestjs/common';
import { WebhookModule } from '../webhook/webhook.module';
import { EventConsumerService } from './services/event/event.consumer';
import { EventInitiatorService } from './services/event/event.intitiator';
import { EventProducer } from './services/event/event.producer';

import { EventService } from './services/event/event.service';

@Module({
    imports: [WebhookModule],
    providers: [EventService, EventConsumerService, EventInitiatorService, EventProducer],
    exports:[EventService, EventInitiatorService, EventConsumerService, EventProducer]
})
export class EventModule {}
