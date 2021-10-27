
import { Document, model } from 'mongoose';
import { AppMode, WebhookStatus, WebhookType } from '../enum/webhook.enum';
import { WebhookSchema } from '../schemas/webhook.schema';
import { WebhookHistory } from './webhook-histories.model';


export interface Webhook extends Document  {
    id?: string;
    appId?: string;
    eventReference?: string;
    retryAttempt?: number;
    eventType?: string;
    url?: string;
    payload?: string;
    mode?: AppMode;
    type?: WebhookType;
    status?: WebhookStatus;
    histories?: WebhookHistory[],
    deletedAt?: Date;
    updatedAt?: Date;
    createdAt?: Date;
}



export const WebhookModel = model<Webhook>('Webhook', WebhookSchema) 
