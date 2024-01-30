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

    const response = await this.gameService.resetGames(user.intraId);
    return response;
  }

  @ApiOperation({
    summary: 'Create an invite to play a game together.',
    description: 'Create an invite you can send to another player that they can accept, to play a game together.',
  })
  @Get('invitePlayer/:playerId')
  async invitePlayer(@GetUser() user: User, @Param('playerId') playerId: number): Promise<any> {
    console.log('GameController.invitePlayer: ' + playerId);

    const response = await this.gameService.invitePlayer(user.intraId, playerId);
    return response;
  }

  @ApiOperation({
    summary: 'Create an invite to play a game together.',
    description: 'Create an invite you can send to another player that they can accept, to play a game together.',
  })
  @Get('acceptInvite/:inviteId')
  async accptInvite(@GetUser() user: User, @Param('inviteId') inviteId: number): Promise<any> {
    console.log('GameController.invitePlayer');

    const response = await this.gameService.acceptInvite(user.intraId, inviteId);
    return response;
  }

  @Get('match_history')
  @ApiOperation({
    summary: 'Get the match history of the authenticated user.',
    description: 'Retrieves the match history of the authenticated user.',
  })
  async getMatchHistory(@GetUser() user: User): Promise<any> {
    console.log('GameController.getMatchHistory');

    const matches = await this.gameService.getMatchHistory(user.intraId);
    return matches;
  }

  @Get('game_status/:intraId')
  @ApiOperation({
    summary: 'Check if a player is in a game.',
    description: 'check if a player is in a game.',
  })
  async getGameStatus(@Param('intraId', ParseIntPipe) intraId: number): Promise<any> {
    console.log('GameController.getGameStatus');

    const response = await this.gameService.getGameStatus(intraId);
    return response;
  }
}
