import { Test, TestingModule } from '@nestjs/testing';
import { HangboardSequenceController } from './hangboard-sequence.controller';

describe('HangboardSequence Controller', () => {
  let controller: HangboardSequenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HangboardSequenceController],
    }).compile();

    controller = module.get<HangboardSequenceController>(HangboardSequenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
