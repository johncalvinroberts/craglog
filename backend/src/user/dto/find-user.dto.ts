import { ObjectID } from 'typeorm';
export class FindUserDto {
  readonly username: string;
  readonly email: string;
  readonly bio?: string;
  readonly image?: string;
  readonly roles?: string[];
  readonly id: ObjectID;
  readonly updatedAt: Date;
  readonly createdAt: Date;
}
