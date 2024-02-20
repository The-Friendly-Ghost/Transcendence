import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { TFAService } from './2fa.service';
import { ParseIntPipe } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Controller('auth/2fa')
@ApiTags('auth/2fa')
export class TFAController {
  constructor(
    private readonly tfa: TFAService,
    private readonly userService: UserService,
  ) {}

  //boken endpoint, I don't know what's wrong.
  @ApiOperation({ summary: 'Get the qr code for google authenticator' })
  @Get('/qrcode/:intraId')
  async get_qr(
    @Response() res: any,
    @Param('intraId', ParseIntPipe) intraId: number,
  ): Promise<string> {
    console.log('TFAController.get_qr');
    // const user: User = await this.userService.getUser(intraId);
    // return await this.tfa.getOtpauthUrl(res, 'ft_transcendence', user.intraId);
    console.log('TFAController.get_qr returning');
    return 'test';
  }

  @ApiOperation({ summary: 'Get secret.' })
  @Get('/secret/:intraId')
  async get_secret(@Param('intraId', ParseIntPipe) intraId: number): Promise<any> {
    console.log('TFAController.get_secret');
    return {
      secret: await this.tfa.get_secret(intraId).catch((e: Error) => {
        return e.message;
      }),
    };
  }

  @ApiOperation({ summary: 'Get secret.' })
  @Get('/tfaEnabled/:intraId')
  async get_tfa_enabled(@Param('intraId', ParseIntPipe) intraId: number): Promise<any> {
    console.log('TFAController.get_is_tfa_enabled');
    return {
      TfaEnabled: await this.tfa.isTFAEnabled(intraId).catch((e: Error) => {
        return e.message;
      }),
    };
  }

  @ApiOperation({ summary: 'Enable 2fa.' })
  @Post('/toggle/:intraId')
  async toggle(
    @Param('intraId', ParseIntPipe) intraId: number,
    @Response() res: any,
  ): Promise<any> {
    console.log('TFAController.enable_2fa');
    let resText: string = '';
    const toggle: boolean = await this.tfa.toggle_2fa(intraId);

    res.clearCookie('TfaEnabled');
    if (toggle === false) {
      resText = 'tfa is disabled.';
      res.cookie('TfaValidated', false, {
        httpOnly: false,
        secure: false,
      });
      // res.clearCookie('TfaEnabled');
      res.cookie('TfaEnabled', false, {
        httpOnly: false,
        secure: false,
      });
    } else {
      resText = 'tfa is enabled.';
      // res.clearCookie('TfaEnabled');
      res.cookie('TfaEnabled', true, {
        httpOnly: false,
        secure: false,
      });
    }
    return res.status(HttpStatus.OK).send(resText);
  }

  @ApiOperation({ summary: 'Enter your code from google authenticator.' })
  @Post('verify/:intraId/:tfacode')
  async verify_2facode(
    @Param('intraId', ParseIntPipe) intraId: number,
    @Param('tfacode') tfacode: string,
    @Response() res: any,
  ): Promise<any> {
    console.log('TFAController.verify_2facode');
    console.log('intraId:', intraId);
    console.log('tfa code:', tfacode);

    const isCodeValid = await this.tfa.compareCodeSecret(tfacode, intraId);
    const user: User = await this.userService.getUser(intraId);

    console.log('isCodeValid:', isCodeValid);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong 2fa code.');
    }

    const loggedUser = await this.tfa.login(intraId, user.name, isCodeValid);
    console.log('loggedUser:', loggedUser);

    console.log('TFAController.verify_2facode creating coockies');
    res.clearCookie('jwt');
    res.cookie('jwt', loggedUser.access_token, {
      httpOnly: false,
      secure: false,
    });
    // res.clearCookie('intraId');
    res.cookie('intraId', intraId, {
      httpOnly: false,
      secure: false,
    });
    // res.clearCookie('TfaValidated');
    console.log('iscoevalid:', isCodeValid);
    res.cookie('TfaValidated', isCodeValid, {
      httpOnly: false,
      secure: false,
    });
    res.cookie('TfaEnabled', true, {
      httpOnly: false,
      secure: false,
    });

    console.log('TFAController.verify_2facode redirecting to frontend');
    // return {
    //   isValid: isCodeValid,
    //   loggedUser,
    //   message: 'Congratulations! You have been authorized to access this aplication!',
    // };
    return res.status(HttpStatus.CREATED).send('tfa is valid.'); // TODO: redirect to frontend in some way
  }
}
