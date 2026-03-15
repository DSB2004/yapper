import { Test, TestingModule } from '@nestjs/testing';
import { Kafka } from './kafka';

describe('Kafka', () => {
  let provider: Kafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Kafka],
    }).compile();

    provider = module.get<Kafka>(Kafka);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
