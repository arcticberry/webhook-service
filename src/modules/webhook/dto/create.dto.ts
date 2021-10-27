import {IsNotEmpty, IsObject, IsString } from "class-validator";
import ObjectLiteral from "src/shared/interfaces/object-literal.interface";
import { AppMode, WebhookType } from "../enum/webhook.enum";

export class CreateWebhookDto {
    @IsNotEmpty()
    @IsString()
    eventType: string;

    @IsNotEmpty()
    @IsString()
    url: string;

    @IsObject()
    @IsNotEmpty()
    payload: ObjectLiteral

    @IsString()
    mode: AppMode

    @IsString()
    @IsNotEmpty()
    type: WebhookType

    @IsString()
    @IsNotEmpty()
    appId: string;
    

}
export class PatternDto {
    @IsNotEmpty()
    @IsString()
    cmd: string;

}

export class CreateEventDto {

    @IsObject()
    @IsNotEmpty()
    pattern: PatternDto
    
    @IsObject()
    @IsNotEmpty()
    data: CreateWebhookDto

}