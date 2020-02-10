import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HangboardSequenceItemDto } from './hangboard-sequence-item.dto';

export class CreateHangboardSequenceDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @MaxLength(100)
  sequence: HangboardSequenceItemDto[];

  @IsOptional()
  @IsBoolean()
  public: false;

  @MaxLength(500)
  boardName = '';
}
