import { Controller, UseGuards, Request, Response, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FortyTwoAuthGuard } from './guard/forty_two_auth.guard';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('')
  @UseGuards(FortyTwoAuthGuard)
  @ApiOperation({ summary: 'Redirects to 42 login' })
  async handleLogin() {}

  @Get('callback')
  @UseGuards(FortyTwoAuthGuard)
  @ApiOperation({ summary: 'Callback after 42 login' })
  async handleCallback(@Request() req: any, @Response() res: any) {
    console.log('AuthController.handleCallback');

    const loggedUser = this.authService.login(req.user.intraId, req.user.name);

    res.clearCookie('jwt');
    res.cookie('jwt', (await loggedUser).access_token, {
      httpOnly: false,
      secure: false,
    });

    console.log('AuthController.handleCallback redirecting to frontend');
    return res.redirect(`http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`);
  }
}
