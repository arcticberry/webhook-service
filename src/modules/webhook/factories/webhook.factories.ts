import { Webhook, WebhookModel } from "../models/webhook.model"
import { ICreateWebhookData } from "../interfaces/create-webhook.interface"
import { WebhookStatus } from "../enum/webhook.enum";

export class WebhookFactory {
    static create(data: ICreateWebhookData) : Webhook {
        const webhook = new WebhookModel();

        webhook.appId = data.appId;
        webhook.eventType = data.eventType;
        webhook.retryAttempt = data.retryAttempt;
        webhook.url = data.url;
        webhook.payload = JSON.stringify(data.payload);
        webhook.mode = data.mode
        webhook.type = data.type
        webhook.status = WebhookStatus.PENDING
        webhook.eventReference = data.eventReference
        
        return webhook;
    }


}