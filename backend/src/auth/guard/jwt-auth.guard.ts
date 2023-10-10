import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import * as request from 'supertest';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('JwtAuthGuard.canActivate beginning of function');
    const request = context.switchToHttp().getRequest();

    if (request.cookies.jwt) {
      request.headers.authorization = 'Bearer ' + request.cookies.jwt;
    }
    const canActivate: boolean | Promise<boolean> | Observable<boolean> = super.canActivate(
      context,
    );
    console.log('JwtAuthGuard.canActivate end of function');
    return canActivate;
  }
}
