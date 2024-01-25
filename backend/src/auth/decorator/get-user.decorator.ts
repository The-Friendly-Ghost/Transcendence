import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request: Express.Request = ctx.switchToHttp().getRequest();
  // console.log('Decorator GetUser request.user', request.user);

  if (data) {
    return request.user[data];
  }
  return request.user;
});
