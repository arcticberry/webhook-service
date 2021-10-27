import { IDomainEvent } from "src/shared/events/event.interface";
import ObjectLiteral from "src/shared/interfaces/object-literal.interface";

export class OutgoingEventCreated implements IDomainEvent {
    occurredOn: Date;

    constructor(public readonly queueName: string, public readonly data: ObjectLiteral) {

    }

    getAggregratedId(): string {
        return ''
    }
}