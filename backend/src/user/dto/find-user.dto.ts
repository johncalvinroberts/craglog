export class FindUserDto {
  readonly username: string;
  readonly email: string;
  readonly bio?: string;
  readonly image?: string;
  readonly roles?: string[];
  readonly id: number;
  readonly updatedAt: Date;
  readonly createdAt: Date;
}
