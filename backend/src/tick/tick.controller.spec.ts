import { Test, TestingModule } from '@nestjs/testing';
import { TickController } from './tick.controller';

describe('Tick Controller', () => {
  let controller: TickController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TickController],
    }).compile();

    controller = module.get<TickController>(TickController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
