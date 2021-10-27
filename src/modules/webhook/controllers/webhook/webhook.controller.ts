import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SuccessResponse } from '../../../../shared/utils/response.utils';
import { CreateEventDto, CreateWebhookDto } from '../../dto/create.dto';
import { WebhookService } from '../../services/webhook/webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) { }

  @MessagePattern({ cmd: 'process_webhook_event' })
  sendEvent(@Req() request, @Body() data: CreateWebhookDto) {

    return this.webhookService.processEvent(data)
  }


  @MessagePattern({ cmd: 'fetch_webhook_event' })
  async getWebhookEvent(@Req() request, @Payload() data) {

    const webhooks = await this.webhookService.getEvents(data)

    return SuccessResponse('Successfully fetched all application webhook', webhooks)
  }


  @MessagePattern({ cmd: 'fetch_single_webhook_event' })
  async getSingleWebhookEvent( @Payload() data) {


    const webhook = await this.webhookService.getOneEvents(data)

    return SuccessResponse('Successfully fetched webhook detail', webhook)
  }

}
