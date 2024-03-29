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
    readonly configService: ConfigService,
    readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeaders = request.headers.authorization;
    const token = authHeaders && (authHeaders as string).split(' ')[1];
    if (!authHeaders || !token) {
      throw new UnauthorizedException();
    }
    let decoded: any;
    try {
      decoded = jwt.verify(token, this.configService.get('JWT_SECRET'));
    } catch (error) {
      if (error.message === 'jwt expired') {
        throw new UnauthorizedException();
      }
      throw error;
    }

    const user = await this.userService.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    request.user = user;
    return true;
  }
}
