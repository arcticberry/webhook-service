import { WebhookHistory, WebhookHistoryModel } from "../models/webhook-histories.model";
import { ICreateWebhookHistoryData } from "../interfaces/create-webhook-histories.interface";

export class WebhookHistoryFactory {
    static create(data: ICreateWebhookHistoryData) : WebhookHistory {
        const webhookHistory = new WebhookHistoryModel();

        webhookHistory.webhook = data.webhook;
        webhookHistory.retryAttempt = data.retryAttempt;
        webhookHistory.statusCode = data.statusCode;
        webhookHistory.status = data.status
        webhookHistory.headers = data.headers
        webhookHistory.headers = data.headers

        
        return webhookHistory;
    }


}