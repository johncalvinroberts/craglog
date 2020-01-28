import { IsNotEmpty } from 'class-validator';
import { ObjectID } from 'typeorm';

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}

export class AuthenticateUserRo {
  username: string;
  email: string;
  token: string;
  bio?: string;
  image?: string;
  roles: string[];
  readonly id: ObjectID;
}
