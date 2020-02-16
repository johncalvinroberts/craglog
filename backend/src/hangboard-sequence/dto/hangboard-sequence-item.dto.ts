import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

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

  @IsArray()
  @IsOptional()
  activeHolds: string[];

  @IsNotEmpty()
  @IsString()
  exercise = '';

  @IsString()
  @IsOptional()
  customExerciseName = '';
}
