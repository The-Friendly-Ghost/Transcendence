import { Body, Controller, Get, Param, ParseIntPipe, Post, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard";
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { TFAService } from "./2fa.service";
import { Response } from "express";

@UseGuards(JwtAuthGuard)
@Controller('2fa')
@ApiTags('2fa')
export class TFAController {
    constructor(private tfa: TFAService) {}

    @ApiOperation({ summary: 'Get the qr code for google authenticator' })
    @Get('qrcode')
    async get_qr(@Res() response: Response, @GetUser() user: User) {
        return await this.tfa.getOtpauthUrl(response, user.name, user.intraId);
    }

    @ApiOperation({ summary: 'Enter your code from google authenticator.' })
    @Post('verify/:tfacode')
    async verify_2facode(@Param('tfacode') tfacode: string, @GetUser('intraId') intraId: number) {
        const isCodeValid = await this.tfa.compareCodeSecret(tfacode, intraId);

        console.log("isCodeValid:", isCodeValid);
        console.log("tfa code:", tfacode);
        console.log("intaId:", intraId);
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong 2fa code.');
        }
        return 'Congratulations! You have been authorized to access this aplication!';
    }

}