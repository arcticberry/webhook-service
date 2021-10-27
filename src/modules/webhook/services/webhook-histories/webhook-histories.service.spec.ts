import { Test, TestingModule } from '@nestjs/testing';
import { WebhookHistoriesService } from './webhook-histories.service';

describe('WebhookHistoriesService', () => {
  let service: WebhookHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookHistoriesService],
    }).compile();

    service = module.get<WebhookHistoriesService>(WebhookHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
