import { Controller, Get } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { AppService } from './app.service';
import { OutgoingEventCreated } from './modules/event/interfaces/outgoing-event-created';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly eventBus: EventBus) {}

  @Get()
  getHello() {
     this.eventBus.publish(new OutgoingEventCreated('webhook_event_queue', {"test": "test"}));

    return this.appService.getHello();
  }
}
