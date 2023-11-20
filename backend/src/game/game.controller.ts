import { Controller, Get, Param, ParseIntPipe, Post, UseGuards, Response } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Jwt2faAuthGuard } from 'src/2fa/guard';
import { GameService } from './game.service';
import { Game } from '@prisma/client';
import { Response as Res } from 'express';

@UseGuards(Jwt2faAuthGuard)
@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @Get('getGame/:gameId')
  @ApiOperation({
    summary: 'Get game by game ID',
    description: 'Retrieves the game with the specified game ID.',
  })
  async getGame(@Param('gameId', ParseIntPipe) gameId: number): Promise<Game> {
    console.log('GameController.getGame gameId', gameId);

    const game = await this.gameService.getGame(gameId);
    return game;
  }

  // temporary endpoint
  @Post('startGame/:p1')
  @ApiTags('start_game')
  async startGame(@Param('p1') p1: string, @Response() res: Res) {

    const game = await this.gameService.startGame(p1);
    return res.redirect(`http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/game`);
  }
}
