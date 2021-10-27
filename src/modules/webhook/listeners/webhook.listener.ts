import { Injectable } from '@nestjs/common';
import { IEventData } from '../interfaces/create-webhook.interface';
import { WebhookService } from '../services/webhook/webhook.service';

@Injectable()
export class WebhookListener {
    constructor(private readonly webhookService: WebhookService) {

    }
    async execute(message, channel) {
        const queueContent = message.content.toString();
        let getContent: IEventData = JSON.parse(queueContent);
        const { pattern: { cmd }, data } = getContent

        switch (cmd) {
            case "process_webhook_event":
                channel.ack(message)
                
            default:
                return {

                };
        }

    }
}