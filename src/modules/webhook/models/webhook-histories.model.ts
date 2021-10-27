import { Document, model } from 'mongoose';
import ObjectLiteral from 'src/shared/interfaces/object-literal.interface';
import { WebhookStatus } from '../enum/webhook.enum';
import { WebhookHistorySchema } from '../schemas/webhook-histories.schema';
import { Webhook } from './webhook.model';

export interface WebhookHistory extends Document {
  id?: string;
  webhook?: Webhook;
  retryAttempt?: number;
  statusCode?: number;
  status?: WebhookStatus;
  headers?: ObjectLiteral;
  deletedAt?: Date;
  updatedAt?: Date;
  createdAt?: Date;
}

export const WebhookHistoryModel = model<WebhookHistory>(
  'WebhookHistory',
  WebhookHistorySchema,
);
