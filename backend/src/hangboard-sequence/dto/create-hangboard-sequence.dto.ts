import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsArray,
  IsBoolean,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HangboardSequenceItemDto } from './hangboard-sequence-item.dto';

export class CreateHangboardSequenceDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested()
  sequence: HangboardSequenceItemDto[];

  @IsOptional()
  @IsBoolean()
  isPublic: false;

  @IsOptional()
  @IsString()
  name = '';

  @IsOptional()
  @IsString()
  description = '';

  @MaxLength(500)
  @IsNotEmpty()
  boardName = '';
}
