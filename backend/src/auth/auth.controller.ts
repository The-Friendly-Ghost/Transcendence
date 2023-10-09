import { Controller, UseGuards, Request, Response, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FortyTwoAuthGuard } from './utils/forty_two_auth.guard';
import { authDto } from './dto/index';
import * as argon from 'argon2';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  //constructor(private prisma: PrismaService) {}
  constructor(private authService: AuthService) {}

  @Get('')
  @UseGuards(FortyTwoAuthGuard)
  @ApiOperation({ summary: 'Redirects to 42 login' })
  async handleLogin() {
    console.log('AuthController.handleLogin');
    // return { msg: 'Redirecting to 42 login page' };
  }

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

  @Get('callback')
  @UseGuards(FortyTwoAuthGuard)
  async handleCallback() {
    return this.authService.callback();
  }

  // singin and signup function as shown in tutorial
  @Post('test_login')
  login(@Body() dto: authDto) {
    console.log(dto);
    return this.authService.test_login(dto);
  }

  @Post('test_signup')
  signup(@Body() dto: authDto) {
    return this.authService.test_signup(dto);
  }
}
