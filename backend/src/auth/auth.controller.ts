import { Controller, UseGuards, Request, Response, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FortyTwoAuthGuard } from './utils/forty_two_auth.guard';
import { authDto } from './dto/auth_dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

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

  // test endpoint to try out hashing and class validation
  @Post('info')
  async create(@Body() authDto: authDto) {
    const hash = await argon.hash(authDto.password);
    console.log(hash);
    return ("created dto, I think. hash:" + hash);
  }

  @Get('callback')
  @UseGuards(FortyTwoAuthGuard)
  async handleCallback() {
    console.log('AuthController.handleCallback');
    return { msg: 'OK' };
  }
}
