import { PassportSerializer } from '@nestjs/passport';

export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: CallableFunction): any {
    console.log('SessionSerializer.serializeUser');
    console.log('user: ', user);

    done(null, user);
  }

  deserializeUser(payload: any, done: CallableFunction): any {
    console.log('SessionSerializer.deserializeUser');

    done(null, payload);
  }
}
