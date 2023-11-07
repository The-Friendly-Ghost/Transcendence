import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('FortyTwoAuthGuard.canActivate beginning of function');
    const activate: boolean = (await super.canActivate(context)) as boolean;
    const request: Request = context.switchToHttp().getRequest();

    console.log('FortyTwoAuthGuard.canActivate before login');
    await super.logIn(request);
    console.log('FortyTwoAuthGuard.canActivate end of function');
    return activate;
  }
}
