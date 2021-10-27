import { ConflictException } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebhookHistory } from '../models/webhook-histories.model';
import { ICreateWebhookHistoryData } from '../interfaces/create-webhook-histories.interface';
import { WebhookHistoryFactory } from '../factories/webhook-histories.factories';


@Injectable()
export class WebhookHistoryRepository {
    constructor(@InjectModel('WebhookHistory') private readonly webhookHistoryModel: Model<WebhookHistory>){}

    public async save(data: ICreateWebhookHistoryData): Promise<WebhookHistory> {

        const webhookAttribute = WebhookHistoryFactory.create(data);

        return await this.webhookHistoryModel.create(webhookAttribute)
    } 
  
}
