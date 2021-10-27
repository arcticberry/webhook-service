import { ConflictException } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebhookFactory } from '../factories/webhook.factories';
import { ICreateWebhookData } from '../interfaces/create-webhook.interface';
import { Webhook } from '../models/webhook.model';
import { generateString } from 'src/shared/utils/helpers.utils';
import { AppMode } from '../enum/webhook.enum';
import ObjectLiteral from 'src/shared/interfaces/object-literal.interface';
import { isRFC3339 } from 'class-validator';

@Injectable()
export class WebhookRepository {
  constructor(
    @InjectModel('Webhook') private readonly webhookModel: Model<Webhook>,
  ) {}

  public async generateEventReference(mode: AppMode): Promise<string> {
    const stringGenerated = `PAYREFLECT-${mode}-${generateString(
      10,
    )}`.toLowerCase();
    const checkIFRefrenceExist = await this.webhookModel
      .findOne({ eventReference: stringGenerated })
      .exec();

    if (checkIFRefrenceExist) {
      return await this.generateEventReference(mode);
    }

    return stringGenerated;
  }

  public async save(data: ICreateWebhookData): Promise<Webhook> {
    const getString = await this.generateEventReference(data.mode);
    data.eventReference = getString;
    const webhookAttribute = WebhookFactory.create(data);

    return await this.webhookModel.create(webhookAttribute);
  }

  public async findById(id: String): Promise<Webhook> {
    const webhook = await this.webhookModel.findOne({ _id: id }).exec();

    return webhook;
  }

  public async findByAppId(appId: string): Promise<Webhook[]> {
    const webhooks = await this.webhookModel
      .find({ appId })
      .populate({path: 'histories'})
      .exec();

    return webhooks;
  }

  public async findOne(data): Promise<Webhook> {
    console.log(data)
    const webhook = await this.webhookModel
      .findOne({ _id: data.webhookId, appId: data.appId })
      .populate({path: 'histories'})
      .exec();
      
      if(!webhook) throw new NotFoundException("Webhook details not found")

    return webhook;
  }

  public async updateWebhook(
    webhook: Webhook,
    data: ObjectLiteral,
  ): Promise<void> {
    Object.assign(webhook, data);
    webhook.histories.push(data.webhookHistoryId);
    await webhook.save();
  }

  public async updateWebhookWithId(
    id: String,
    data: ObjectLiteral,
  ): Promise<void> {
    const webhook = await this.findById(id);
    await this.updateWebhook(webhook, data);
  }
}
