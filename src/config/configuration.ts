
const dotenv = require('dotenv');
dotenv.config();

export default () => (
    {
        [process.env.WEBHOOK_EVENT_QUEUE]: {
          exchanges: [
            { name: 'SEND_WEBHOOK', type: 'fanout' }
          ],
          bindings: [
            { exchange: 'SEND_WEBHOOK', target: process.env.WEBHOOK_EVENT_QUEUE },
          ],
          queues: [
            { name: process.env.WEBHOOK_EVENT_QUEUE },
          ],
          retryTtlQueues: [
            { name: 'webhook_event_queue-retry-1-30s', delay: 30000 },
            { name: 'webhook_event_queue-retry-2-5m', delay: 300000 },
            { name: 'webhook_event_queue-retry-3-25m', delay: 1500000},
            { name: 'webhook_event_queue-retry-4-50m', delay: 3000000},
            { name: 'webhook_event_queue-retry-5-1h-40m', delay: 6000000},
          ]
        },
        'test': {
            exchanges: [
              { name: 'TEST_WEBHOOK', type: 'fanout' }
            ],
            bindings: [
              { exchange: 'TEST_WEBHOOK', target: 'test' },
            ],
            queues: [
              { name: 'test' },
            ],
            retryTtlQueues: [
              { name: 'test_queue-retry-1-30s', delay: 30000 },
              { name: 'test_queue-retry-2-5m', delay: 300000 },
              { name: 'test_queue-retry-3-25m', delay: 1500000},
              { name: 'test_queue-retry-4-50m', delay: 3000000},
              { name: 'test_queue-retry-5-1h-40m', delay: 6000000},
            ]
          }
      
    }
)