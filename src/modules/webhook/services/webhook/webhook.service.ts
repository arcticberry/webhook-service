// import { HttpService } from '@nestjs/axios';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { TimeoutError } from 'rxjs/internal/operators/timeout';
import ObjectLiteral from 'src/shared/interfaces/object-literal.interface';
import { OutgoingEventCreated } from '../../../event/interfaces/outgoing-event-created';
import { WebookHttpService } from '../../../http/services/http/http.service';
import { WebhookStatus } from '../../enum/webhook.enum';
import { ICreateWebhookData, IEventData } from '../../interfaces/create-webhook.interface';
import { WebhookHistoryModel } from '../../models/webhook-histories.model';
import { Webhook } from '../../models/webhook.model';
import { WebhookHistoryRepository } from '../../repositories/webhook-histories.repository';
import { WebhookRepository } from '../../repositories/webhook.repository';
import { successCode } from '../../utils/status-code.utils';
import { WebhookHistoriesService } from '../webhook-histories/webhook-histories.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly eventBus: EventBus,
    private readonly webhookRepo: WebhookRepository,
    private readonly webhookHistoryService: WebhookHistoriesService, //private readonly httpRequest: WebookHttpService,
  ) {}

  async execute(message, channel) {
    let getContent: ObjectLiteral = {};
    try {
      const queueContent = message.content.toString();
      getContent = JSON.parse(queueContent);

      const payload = {
        eventReference: getContent.eventReference,
        event: getContent.eventType,
        data: JSON.parse(getContent.payload),
      };
      

      const httpRequest = new WebookHttpService(new HttpService());
      const makeCall = await httpRequest.post(getContent.url, payload);

      const { status, headers } = makeCall;


      if (successCode.includes(status)) {
        const webhookHistory = await this.webhookHistoryService.create({
          webhook: getContent.id,
          retryAttempt: getContent.try_attempt,
          statusCode: status,
          status: successCode.includes(status)
            ? WebhookStatus.SUCCESSFUL
            : WebhookStatus.FAILED,
          headers,
        });

        await this.webhookRepo.updateWebhookWithId(getContent.id, {
          retryAttempt: getContent.try_attempt,
          webhookHistoryId: webhookHistory._id,
          status: successCode.includes(status)
            ? WebhookStatus.SUCCESSFUL
            : WebhookStatus.PENDING,
        });

        channel.ack(message);
      } else {
    
        throw new Error('Error in handler');
      }
    } catch (error) {

      new Logger.error({error}, error.message);
      const { code } = error;
      let statusCode = 500
      let header= {}
  
  
      if (error.response){

        let { status, headers } = error.response;
        statusCode  = status
        header  = headers
      } 
      
      const webhookHistory = await this.webhookHistoryService.create({
        webhook: getContent.id,
        retryAttempt: getContent.try_attempt,
        statusCode: code == "ECONNABORTED" ? 503 : statusCode || 500,
        status: successCode.includes(statusCode || 500)
          ? WebhookStatus.SUCCESSFUL
          : WebhookStatus.FAILED,
        headers: header,
      });

      await this.webhookRepo.updateWebhookWithId(getContent.id, {
        retryAttempt: getContent.try_attempt,
        webhookHistoryId: webhookHistory._id,
        status: successCode.includes(statusCode || 500)
          ? WebhookStatus.SUCCESSFUL
          : WebhookStatus.PENDING,
      });

      throw error;
    }
  }

  async processEvent(data: ICreateWebhookData): Promise<Webhook> {
    const webhook = await this.webhookRepo.save(data);

    this.eventBus.publish(
      new OutgoingEventCreated('webhook_event_queue', webhook),
    );

    return webhook;
  }

  async sendEvent(data: IEventData): Promise<boolean> {
    this.eventBus.publish(
      new OutgoingEventCreated('webhook_queue', data),
    );

    return true;
  }

  async getEvents(data: ObjectLiteral): Promise<Webhook[]> {
    const webhooks = await this.webhookRepo.findByAppId(data.appId);

    return webhooks;
  }

  async getOneEvents(data: ObjectLiteral): Promise<Webhook> {
    const webhook = await this.webhookRepo.findOne(data);
    
    return webhook;
  }
}
