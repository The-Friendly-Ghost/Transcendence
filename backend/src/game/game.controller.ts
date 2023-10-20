import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Jwt2faAuthGuard } from 'src/2fa/guard';
import { GameService } from './game.service';
import { Game } from '@prisma/client';

@UseGuards(Jwt2faAuthGuard)
@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

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
}
