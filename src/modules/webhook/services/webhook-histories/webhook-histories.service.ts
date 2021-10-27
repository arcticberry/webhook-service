import { Injectable } from '@nestjs/common';
import { ICreateWebhookHistoryData } from '../../interfaces/create-webhook-histories.interface';
import { WebhookHistory } from '../../models/webhook-histories.model';
import { WebhookHistoryRepository } from '../../repositories/webhook-histories.repository';

@Injectable()
export class WebhookHistoriesService {
    constructor(private readonly webhookHistoriesRepo: WebhookHistoryRepository){}

    async create(data: ICreateWebhookHistoryData): Promise<WebhookHistory> {

        const webhookHistories = await this.webhookHistoriesRepo.save(data);
    
        return webhookHistories;
      }
}
