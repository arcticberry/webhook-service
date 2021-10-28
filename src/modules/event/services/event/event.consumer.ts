import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventInitiatorService } from './event.intitiator';
import { EventService } from './event.service';
import { WebhookService } from 'src/modules/webhook/services/webhook/webhook.service';
import { eventQueueMap } from './utils/events.util';
import { ConfigService } from '@nestjs/config';
import { WebhookListener } from 'src/modules/webhook/listeners/webhook.listener';

const contentTypeJson = 'application/json';
const contentEncoding = 'utf8';

@Injectable()
export class EventConsumerService {
  constructor(
    private readonly eventInitiator: EventInitiatorService,
    private readonly eventService: EventService,
    private readonly configService: ConfigService,
    private readonly webhookService: WebhookService,
   // private readonly webhookListener: WebhookListener,
  ) {}

  onModuleInit() {
    for (const [queueName, handlerService] of Object.entries(eventQueueMap)) {
      this.eventInitiator.assert().then(() => {
        this.consume(queueName, this[handlerService]);
      });
    }
  }

  public consume(queue, handler, options = {}) {
    return this.eventService
      .getInstance()
      .catch(console.error)
      .then(({ channel }) => {
        channel.consume(queue, (msg) => {
          console.log('msg.fields.redelivered---->>', msg.fields.redelivered);
          channel.ack(msg)
          if (msg.fields.redelivered) {
            new Promise((resolve, reject) => {
              reject(
                new Error(
                  `Message was redelivered from ${queue} so somthing is wrong`,
                ),
              );
            });

            channel.ack(msg)

            return;
          }

          if (queue == "webhook_event_queue") {
            handler.execute(msg, channel).catch((reasonOfFailure) => {
              this.sendMsgToRetry({
                msg,
                queue,
                channel,
                reasonOfFailure,
              });
            });
          } else {
            handler.execute(msg, channel)
          }
        });
      });
  }

  private getAttemptAndUpdatedContent(msg) {
    let content = JSON.parse(msg.content.toString(contentEncoding));

    content.exchange = content.exchange || msg.fields.exchange;
    content.try_attempt = ++content.try_attempt || 1;

    const attempt = content.try_attempt;

    content = Buffer.from(JSON.stringify(content), contentEncoding);

    return { attempt, content };
  }

  private sendMsgToRetry(args) {
    const { channel, queue, msg } = args;
    const attemptsTotal = this.configService.get(
      `${queue}.retryTtlQueues`,
    ).length;
    const { attempt, content } = this.getAttemptAndUpdatedContent(msg);

    if (attempt <= attemptsTotal) {
      const ttlxName = this.eventInitiator.getTTLXName({ queue });
      const routingKey = this.eventInitiator.getTTLRoutingKey({ attempt });
      const options = {
        contentEncoding,
        contentType: contentTypeJson,
        persistent: true,
      };

      Object.keys(msg.properties).forEach((key) => {
        options[key] = msg.properties[key];
      });

      

      return channel.publish(ttlxName, routingKey, content, options);
    } 

    channel.ack(msg);

    return Promise.resolve();
  }
}
