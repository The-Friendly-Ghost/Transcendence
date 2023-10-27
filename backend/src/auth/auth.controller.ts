import {
  Controller,
  UseGuards,
  Request,
  Response,
  Get,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guard';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { TFAService } from 'src/2fa/2fa.service';
import { Jwt2faAuthGuard } from 'src/2fa/guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly tfaService: TFAService,
  ) {}

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

    const user: User = await this.userService.getUser(req.user.intraId);
    const loggedUser: { access_token: string } = await this.authService.login(
      user.intraId,
      user.name,
    );

    console.log('AuthController.handleCallback creating coockies');
    console.log('req.cookies', req.cookies);
    console.log('req.cookies.TfaValidated', req.cookies.TfaValidated);
    res.clearCookie('jwt');
    res.cookie('jwt', loggedUser.access_token, {
      httpOnly: false,
      secure: false,
    });

    res.cookie('intraId', user.intraId, {
      httpOnly: false,
      secure: false,
    });
    res.cookie('username', user.name, {
      httpOnly: false,
      secure: false,
    });
    if (!user.twoFAEnabled) {
      console.log('AuthController.handleCallback redirecting to frontend');
      res.clearCookie('TfaValidated');
      res.cookie('TfaValidated', true, {
        httpOnly: false,
        secure: false,
      });
      return res.redirect(`http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`);
    }

    return res.redirect(
      `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/auth/tfa`,
    );
  }

  @Get('validate')
  @UseGuards(Jwt2faAuthGuard)
  @ApiOperation({
    summary: 'Validate JWT',
    description: 'Validates the JWT.',
  })
  async validate(@Request() req: any, @Response() res: any) {
    console.log('AuthController.validate');
    console.log('AuthController.validate req.user', req.user);

    const user: User = await this.userService.getUser(req.user.intraId);

    /* 
    Checks if the user has 2FA enabled. 
    If so, sets TfaValidated to false and redirects to the 2FA page.
    If not, sets TfaValidated to true and redirects to the home page.
    */
    if (user.twoFAEnabled) 
    {
      res.cookie('TfaValidated', false, {
        httpOnly: false,
        secure: false,
      }) ;
      return (res.redirect(
        `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/auth/tfa`, ));
    }
    else {
      res.cookie('TfaValidated', true, {
        httpOnly: false,
        secure: false,
      }) ;
      console.log('AuthController.handleCallback redirecting to frontend');
      return (res.redirect(`http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`));
    }

    console.log('AuthController.validate redirecting to frontend');
    return res.status(HttpStatus.OK);
  }

  @Get('logout')
  @ApiOperation({
    summary: 'Handle logout',
    description: 'Logs out the user.',
  })
  async handleLogout(@Response() res: any) {
    console.log('AuthController.handleLogout');
    res.clearCookie('jwt');
    res.clearCookie('intraId');
    res.clearCookie('username');
    console.log('cleared cookie');
    res.clearCookie('TfaValidated');
    return res.redirect(`http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`);
  }
}
