import { Controller, UseGuards, Request, Response, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FortyTwoAuthGuard } from './utils/forty_two_auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('')
  @UseGuards(FortyTwoAuthGuard)
  @ApiOperation({ summary: 'Redirects to 42 login' })
  async handleLogin() {
    console.log('AuthController.handleLogin');
    // return { msg: 'Redirecting to 42 login page' };
  }

  @Get('callback')
  @UseGuards(FortyTwoAuthGuard)
  async handleCallback() {
    console.log('AuthController.handleCallback');
    return { msg: 'OK' };
  }
}
