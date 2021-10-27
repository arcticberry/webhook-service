export interface IDomainEvent {
    queueName: string

    occurredOn: Date

    getAggregratedId(): string | number;
}