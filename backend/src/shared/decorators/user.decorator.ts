import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FindUserDto } from '../../user/dto';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): FindUserDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
