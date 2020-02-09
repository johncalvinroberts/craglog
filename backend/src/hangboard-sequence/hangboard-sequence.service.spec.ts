import { Test, TestingModule } from '@nestjs/testing';
import { HangboardSequenceService } from './hangboard-sequence.service';

describe('HangboardSequenceService', () => {
  let service: HangboardSequenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HangboardSequenceService],
    }).compile();

    service = module.get<HangboardSequenceService>(HangboardSequenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
