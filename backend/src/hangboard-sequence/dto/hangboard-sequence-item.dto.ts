import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class HangboardSequenceItemDto {
  @IsNumber()
  @IsNotEmpty()
  rest = 0;

  @IsNumber()
  @IsOptional()
  duration = 0;

  @IsNumber()
  @IsOptional()
  repetitions = 0;

  @IsNumber()
  @IsOptional()
  left = 0;

  @IsNumber()
  @IsOptional()
  right = 0;

  @IsNotEmpty()
  @IsString()
  exercise = '';
}
