import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeaders = request.headers.authorization;
    const token = authHeaders && (authHeaders as string).split(' ')[1];
    if (!authHeaders || !token) {
      throw new UnauthorizedException();
    }

    const decoded: any = jwt.verify(
      token,
      this.configService.get('JWT_SECRET'),
    );

    const user = await this.userService.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = user;
    return true;
  }
}
