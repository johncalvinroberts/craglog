import { MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly resetToken: string;

  @ApiProperty({ example: 'password', minLength: 8 })
  @MinLength(8)
  readonly password: string;
}
