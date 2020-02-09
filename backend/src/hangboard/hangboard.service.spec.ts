import { Test, TestingModule } from '@nestjs/testing';
import { HangboardService } from './hangboard.service';

describe('HangboardService', () => {
  let service: HangboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HangboardService],
    }).compile();

    service = module.get<HangboardService>(HangboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
