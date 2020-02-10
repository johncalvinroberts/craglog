import { IsNumber, IsNotEmpty } from 'class-validator';

export class HangboardSequenceItemDto {
  @IsNumber()
  @IsNotEmpty()
  rest = 0;

  @IsNumber()
  duration = 0;

  @IsNumber()
  repetitions = 0;

  @IsNumber()
  left = null;

  @IsNumber()
  right = null;

  @IsNotEmpty()
  exercise = '';
}
