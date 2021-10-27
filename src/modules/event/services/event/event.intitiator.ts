import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EventService } from './event.service';

@Injectable()
export class EventInitiatorService {
  private consumer;
  private channel;


  constructor(
    private readonly eventService: EventService,
    private readonly configService: ConfigService,
   
  ) {
    
  }

  onModuleInit() {
    this.channel = this.assert();
  }

  public assert() {return this.eventService.getInstance().catch(console.error).then(async ({ channel }) => {
    await this.assertExchanges(channel);
    await this.assertQueues(channel);
    await this.bindExchangesToQueues(channel);
});}

  private getDLXName(options) {
    const { queue } = options;
    return `DLX-${queue}`.replace(/-/g, '_').toUpperCase();
  }

  public getTTLXName(options) {
    const { queue } = options;
    return `TTL-${queue}`.replace(/-/g, '_').toUpperCase();
  }

  private getTTLQName(config, options) {
    const { queue } = options;
    const attempt = options.attempt || 1;
    return config[attempt - 1].name.replace('notification_queue', queue);
  }

  public getTTLRoutingKey(options) {
    const attempt = options.attempt || 1;
    return `retry-${attempt}`;
  }

  private async mapAssertExchangeConfig(channel, mapKey, queue_type = null) {
    const arr = [];
    

    let configData = Object.entries(this.configService)[0]

    configData.shift()

     for (let index = 0; index < configData.length; index++) {

        const data = configData[index];
        
        //console.log(this.configService.get(index))
        for (const [_, value] of Object.entries(data)) {
            
            arr.concat(
                value[mapKey]
                  .map(({ name = null, type = null, delay = null }) => {
                      
                    if (mapKey == 'exchanges') {
                        
                      return channel.assertExchange(name, type, {
                        durable: true,
                      });
                    }
                    if (mapKey == 'queues') {
                      const queueAlt = this[
                        queue_type == 'fanout' ? 'getDLXName' : 'getTTLXName'
                      ]({ queue: name });
                      channel.assertExchange(queueAlt, queue_type, {
                        durable: true,
                      });
                    }
                  }),
              );
        }
      
    }
    return arr;
  }

  private async assertExchanges(channel) {
    return Promise.all(
      []
        // "real" payload exchanges
        .concat(this.mapAssertExchangeConfig(channel, 'exchanges'))
        .concat(this.mapAssertExchangeConfig(channel, 'queues', 'fanout'))
        .concat(this.mapAssertExchangeConfig(channel, 'queues', 'direct')),
    );
  }

  private async mapAssertQueueConfig(channel) {
    const arr = [];

    let configData = Object.entries(this.configService)[0]

    configData.shift()

    for (let index = 0; index < configData.length; index++) {

        const data = configData[index];

        for (const [key, value] of Object.entries(data)) {
            arr.concat(
                value['queues'].map(({ name: queue }) => {
                const dlxName = this.getDLXName({ queue });
      
                return Promise.all(
                  []
                    // "real" payload queue
                    .concat(channel.assertQueue(queue, { durable: true }))
      
                    // a few ttl queues per one "real" queue
                    .concat(
                        value['retryTtlQueues']
                        .map((ttlQueue, index) => {
                          const attempt = index + 1;
      
                          const ttlQueueName = this.getTTLQName(
                            value['retryTtlQueues'],
                            { queue, attempt },
                          );
      
                          return channel.assertQueue(ttlQueueName, {
                            durable: true,
                            deadLetterExchange: dlxName, // x-dead-letter-exchange
                            messageTtl: ttlQueue.delay, // x-message-ttl
                            // we can use this key for decreasing queues amount:
                            // deadLetterRoutingKey: dlxName
                          });
                        }),
                    ),
                );
              }),
            );
          }

    }

    
    return arr;
  }

  private async assertQueues(channel) {
    return Promise.all([].concat(this.mapAssertQueueConfig(channel)));
  }

  private async mapBindExchangesToQueuesConfig(channel) {
    const arr = [];

    let configData = Object.entries(this.configService)[0]

    configData.shift()

    for (let index = 0; index < configData.length; index++) {

        const data = configData[index];

        for (const [key, value] of Object.entries(data)) {
            arr.concat(
                value['bindings']
                .map(({ target, exchange }) => {
                  return channel.bindQueue(target, exchange);
                })
      
                .concat(
                    value['queues'].map(({ name: queue }) => {
                    const dlxName = this.getDLXName({ queue });
                    const ttlxName = this.getTTLXName({ queue });
      
                    return Promise.all(
                      []
                        // DLX to "real" payload exchange
                        .concat(channel.bindQueue(queue, dlxName))
      
                        // TTLX to ttl queues
                        .concat(
                            value['retryTtlQueues']
                            .map((ttlQueue, index) => {
                              const attempt = index + 1;
                              const ttlqName = this.getTTLQName(
                                value['retryTtlQueues'],
                                { queue, attempt },
                              );
                              const routingKey = this.getTTLRoutingKey({ attempt });
      
                              return channel.bindQueue(
                                ttlqName,
                                ttlxName,
                                routingKey,
                              );
                            }),
                        ),
                    );
                  }),
                ),
            );
          }

    }

    
    return arr;
  }

  private async bindExchangesToQueues(channel) {
    return Promise.all(
      []
        // bind "real" payload exchanges to "real" payload queues
        .concat(this.mapBindExchangesToQueuesConfig(channel)),
    );
  }

}
