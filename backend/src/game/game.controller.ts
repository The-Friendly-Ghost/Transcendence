// import { Controller, Get, Param, ParseIntPipe, Post, UseGuards, Response } from '@nestjs/common';
// import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { Jwt2faAuthGuard } from 'src/2fa/guard';
// import { GameService } from './game.service';
// import { Game, User } from '@prisma/client';
// import { Response as Res } from 'express';
// import { GetUser } from 'src/auth/decorator';

// @UseGuards(Jwt2faAuthGuard)
// @Controller('game')
// @ApiTags('game')
// export class GameController {
//   constructor(private readonly gameService: GameService) { }

//   @Get('searchGame')
//   @ApiOperation({
//     summary: 'Search game for a game and create one if none exists.',
//     description: 'Searches for an open game.',
//   })
//   async searchGame(@GetUser() user: User): Promise<Game> {
//     console.log('GameController.searchGame');
//     // console.log('GameController.searchGame user', user);

//     const game = await this.gameService.searchGame(user.intraId);
//     return game;
//   }

//   @Get('getGame/:gameId')
//   @ApiOperation({
//     summary: 'Get game by game ID',
//     description: 'Retrieves the game with the specified game ID.',
//   })
//   async getGame(@Param('gameId', ParseIntPipe) gameId: number): Promise<Game> {
//     console.log('GameController.getGame gameId', gameId);

//     const game = await this.gameService.getGame(gameId);
//     return game;
//   }

//   // temporary endpoint
//   @Post('startGame/:p1')
//   @ApiTags('start_game')
//   async startGame(@Param('p1') p1: string, @Response() res: Res) {

//     const game = await this.gameService.startGame(p1);
//     return res.redirect(`http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/game`);
//   }
// }
