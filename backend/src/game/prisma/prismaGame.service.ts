import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Game, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { findGameDto, updateGameScoreDto } from '../dto';

@Injectable()
export class PrismaGameService {
  constructor(private prisma: PrismaService) { }

  async resetGames(): Promise<boolean> {
    const games: Game[] = await this.prisma.game
      .findMany()
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error('PrismaGameService.resetGames error reason: ' + e.message + ' code: ' + e.code);
        throw new InternalServerErrorException();
      });
    if (games.length == 0) {
      return true;
    }
    const deleteGames = games.map((game: Game) => {
      return this.prisma.game.delete({ where: { id: game.id } });
    });
    await this.prisma.$transaction(deleteGames).catch((e: Prisma.PrismaClientKnownRequestError) => {
      console.error(
        'PrismaGameService.resetGames error reason: ' + e.message + ' code: ' + e.code,
      );
      throw new InternalServerErrorException();
    });
    return true;
  }

  async createGame(data: Prisma.GameCreateInput): Promise<Game> {
    const game: Game = await this.prisma.game
      .create({
        data: data,
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaGameService.insertGame error reason: ' + e.message + ' code: ' + e.code,
        );
        throw new NotFoundException();
      });
    return game;
  }

  async findGame(dto: findGameDto): Promise<Game> {
    const game: Game = await this.prisma.game
      .findUniqueOrThrow({
        where: { id: dto.gameId },
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error('PrismaGameService.findGame error reason: ' + e.message + ' code: ' + e.code);
        throw new NotFoundException();
      });
    return game;
  }

  async updateGame(game: Game): Promise<boolean> {
    await this.prisma.game
      .update({
        where: { id: game.id },
        data: game,
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaGameService.updateGame error reason: ' + e.message + ' code: ' + e.code,
        );
        throw new InternalServerErrorException();
      });
    return (true);
  }

  async searchGame(): Promise<Game> {
    const game: Game[] = await this.prisma.game
      .findMany({
        where: {
          state: "PENDING"
        },
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error('PrismaGameService.findGame error reason: ' + e.message + ' code: ' + e.code);
        throw new NotFoundException();
      });
    return game[0];
  }

  async updateGameScore(dto: updateGameScoreDto): Promise<Game> {
    const game: Game = await this.prisma.game
      .update({
        data: { score: dto.score },
        where: { id: dto.gameId || undefined },
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaGameService.updateGameScore error reason: ' + e.message + ' code: ' + e.code,
        );
        throw new InternalServerErrorException();
      });
    return game;
  }

  async updateEndGame(data: Prisma.GameUpdateArgs): Promise<Game> {
    const game: Game = await this.prisma.game
      .update(data)
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaGameService.updateEndGame error reason: ' + e.message + ' code: ' + e.code,
        );
        throw new InternalServerErrorException();
      });
    return game;
  }
}
