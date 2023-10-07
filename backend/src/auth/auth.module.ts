import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './utils/forty_two.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [FortyTwoStrategy, AuthService],
})
export class AuthModule {}
