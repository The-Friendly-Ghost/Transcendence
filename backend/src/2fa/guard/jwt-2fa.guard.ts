import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class Jwt2faAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('Jwt2faAuthGuard.canActivate beginning of function');
    const request = context.switchToHttp().getRequest();

    console.log('Jwt2faAuthGuard.canActivate request.cookies', request.cookies);
    if (request.cookies.jwt) {
      console.log('Jwt2faAuthGuard.canActivate request.cookies.jwt', request.cookies.jwt);
      request.headers.authorization = 'Bearer ' + request.cookies.jwt;
    }
    const canActivate: boolean | Promise<boolean> | Observable<boolean> = super.canActivate(
      context,
    );
    console.log('Jwt2faAuthGuard.canActivate canActivate:', canActivate);
    console.log('Jwt2faAuthGuard.canActivate end of function');
    return canActivate;
  }
}
