import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from 'shared/config';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.['access_token'];
    if (!token) {
      throw new UnauthorizedException('No access token');
    }
    try {
      const payload = jwt.verify(token, config.jwt.secret) as {sub: string, email: string};
      request['user'] = {
        username: payload.sub,
        email: payload.email,
      };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
