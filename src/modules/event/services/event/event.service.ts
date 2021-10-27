import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AmqpClient from 'amqplib';

@Injectable()
export class EventService implements OnModuleInit {
    private  amqp;

    constructor() {
        
    }

    async onModuleInit() {
        this.amqp = this.pConnect();
    }

    public getInstance() {
        return this.amqp;
    }

    private pConnect() {
		 return AmqpClient.connect(process.env.RABBITMQ_URL)
			.catch(console.error)
			.then((cnx) =>
				cnx
					.createChannel()
					.catch(console.error)
					.then((channel) => ({ channel, connection: cnx })),
			)
			.catch(console.error);
	}
}