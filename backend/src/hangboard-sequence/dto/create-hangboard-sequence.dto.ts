import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsArray,
  IsBoolean,
  IsString,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { HangboardSequenceItemDto } from './hangboard-sequence-item.dto';

export class CreateHangboardSequenceDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ArrayMaxSize(200)
  @Type(() => HangboardSequenceItemDto)
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
