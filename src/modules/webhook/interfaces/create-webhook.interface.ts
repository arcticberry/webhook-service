import ObjectLiteral from "src/shared/interfaces/object-literal.interface";
import { AppMode, WebhookType } from "../enum/webhook.enum";
import { WebhookHistory } from "../models/webhook-histories.model";

export class ICreateWebhookData {
    appId?: string;
    eventType: string;
    retryAttempt?: number;
    url: string;
    payload: ObjectLiteral;
    histories?: WebhookHistory[];
    mode?: AppMode;
    type?: WebhookType;
    eventReference?: string
    
}

export class IEventData {
    pattern: {
        cmd: string
    };
    data: ICreateWebhookData
}