import ObjectLiteral from "src/shared/interfaces/object-literal.interface";
import {  WebhookStatus,  } from "../enum/webhook.enum";
import { WebhookHistory } from "../models/webhook-histories.model";
import { Webhook } from "../models/webhook.model";

export class ICreateWebhookHistoryData {
    webhook?: Webhook;
    retryAttempt?: number;
    statusCode?: number;
    status?: WebhookStatus;
    headers?: ObjectLiteral
}