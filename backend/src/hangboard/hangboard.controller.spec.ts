import { Test, TestingModule } from '@nestjs/testing';
import { HangboardController } from './hangboard.controller';

describe('Hangboard Controller', () => {
  let controller: HangboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HangboardController],
    }).compile();

    controller = module.get<HangboardController>(HangboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
