import { Controller, UseGuards, Request, Response, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FortyTwoAuthGuard } from './utils/forty_two_auth.guard';
import { authDto } from './dto/index';
import * as argon from 'argon2';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('')
  @UseGuards(FortyTwoAuthGuard)
  @ApiOperation({ summary: 'Redirects to 42 login' })
  async handleLogin() {}

  @Get('test')
  async testFunc() {
    console.log("executed auth/test endpoint.");
    return ("executed auth/test endpoint");
  }

  // test endpoint to try out hashing and class validation
  @Post('info')
  async create(@Body() authDto: authDto) {
    console.log("info endpont has been activated");
    console.log(authDto.password);
    // const salt = await bcrypt.genSalt();
    // const hash = await bcrypt.hash(authDto.password, salt);
    const hash = authDto.password;
    // console.log("info2 endpont has been activated");
    // const user = await this.prisma.user.create({
    //   data: {
    //     id:       35,
    //     intraId: "svos",
    //     name:     "testje",
    //     password: hash,
    //   },
    // });
    // return user;
    return 'nonesense';
  }

  // singin and signup function as shown in tutorial
  @Post('test_login')
  login(@Body() dto: authDto) {
    console.log(dto);
    return this.authService.test_login(dto);
  }

  @Post('test_signup')
  signup(@Body() dto: authDto) {
    return this.authService.test_signup(dto);}


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
