import { Injectable, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import ObjectLiteral from 'src/shared/interfaces/object-literal.interface';
import { OutgoingEventCreated } from '../../interfaces/outgoing-event-created';
import { EventService } from './event.service';
import * as amqp from 'amqplib';

@Injectable()
@EventsHandler(OutgoingEventCreated)
export class EventProducer implements IEventHandler<OutgoingEventCreated> {
  private producer;
  constructor(private readonly eventService: EventService) {}

  async onModuleInit() {
   
  }

  async handle({ queueName, data }: OutgoingEventCreated) {
    
    await this.publishEvent(queueName, data);
  }

  private async publishEvent(queueName: string, data: any) {
    try {
     
     this.eventService.getInstance().then(async ({ channel })=> {
        await channel.assertQueue(queueName, true);    
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)))
      })
      console.info(' [x] Sending message to queue', queueName, data);
    } catch (error) {
       Logger.error({ error }, error.message );
    }
  }
}
