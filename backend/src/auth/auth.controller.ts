import { Controller, UseGuards, Request, Response, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FortyTwoAuthGuard } from './guard/forty_two_auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('')
  @UseGuards(FortyTwoAuthGuard)
  @ApiOperation({
    summary: 'Handle login',
    description: 'Redirects the user to the OAuth provider for authentication.',
  })
  async handleLogin() {}

  @Get('callback')
  @UseGuards(FortyTwoAuthGuard)
  @ApiOperation({
    summary: 'Handle authentication callback',
    description:
      'Handles the authentication callback from the OAuth provider and logs in the user.',
  })
  async handleCallback(@Request() req: any, @Response() res: any) {
    console.log('AuthController.handleCallback');
    console.log('AuthController.handleCallback req.user.intraId', req.user.intraId);
    console.log('AuthController.handleCallback req.user', req.user);

    const loggedUser = this.authService.login(req.user.intraId, req.user.name);

    res.clearCookie('jwt');
    res.cookie('jwt', (await loggedUser).access_token, {
      httpOnly: false,
      secure: false,
    });

    console.log('AuthController.handleCallback redirecting to frontend');
    return res.redirect(`http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Handle logout',
    description: 'Logs out the user.',
  })
  async handleLogout(@Response() res: any) {
    console.log('AuthController.handleLogout');
    res.clearCookie('jwt');
    return res.redirect(`http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`);
  }
}
