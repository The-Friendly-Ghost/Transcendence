import { Controller, Get, Param, ParseIntPipe, Post, UseGuards, Response } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Jwt2faAuthGuard } from 'src/2fa/guard';
import { GameService } from './game.service';
import { GameInfo, User } from '@prisma/client';
import { Response as Res } from 'express';
import { GetUser } from 'src/auth/decorator';

@UseGuards(Jwt2faAuthGuard)
@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @ApiOperation({
    summary: 'Reset all games in the database.',
    description: 'Resets all games in the database.',
  })
  @Get('resetGames')
  async resetGames(@GetUser() user: User): Promise<any> {
    console.log('GameController.resetGames');
    // console.log('GameController.resetGames user', user);

    const response = await this.gameService.resetGames(user.intraId);
    return response;
  }
}
