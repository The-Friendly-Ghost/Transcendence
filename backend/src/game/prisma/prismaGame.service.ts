import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GameInfo, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { findGameDto, findGameByIdDto, updateGameScoreDto } from '../dto';

@Injectable()
export class PrismaGameService {
  constructor(private prisma: PrismaService) { }

  async resetGames(): Promise<boolean> {
    const games: GameInfo[] = await this.prisma.gameInfo
      .findMany()
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error('PrismaGameService.resetGames error reason: ' + e.message + ' code: ' + e.code);
        throw new InternalServerErrorException();
      });
    if (games.length == 0) {
      return true;
    }
    const deleteGames = games.map((game: GameInfo) => {
      return this.prisma.gameInfo.delete({ where: { id: game.id } });
    });
    await this.prisma.$transaction(deleteGames).catch((e: Prisma.PrismaClientKnownRequestError) => {
      console.error(
        'PrismaGameService.resetGames error reason: ' + e.message + ' code: ' + e.code,
      );
      throw new InternalServerErrorException();
    });
    return true;
  }

  async createGame(data: Prisma.GameInfoCreateInput): Promise<GameInfo> {
    return await this.prisma.gameInfo
      .create({
        data: data,
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaGameService.insertGame error reason: ' + e.message + ' code: ' + e.code,
        );
        throw new NotFoundException();
      });;
  }

  async createInvite(data: Prisma.InviteCreateInput): Promise<any> {
    return await this.prisma.invite
      .create({
        data: data,
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaGameService.createInvite error reason: ' + e.message + ' code: ' + e.code,
        );
        throw new NotFoundException();
      });;
  }

  async findInvite(data: Prisma.InviteFindFirstArgs): Promise<any> {
    return await this.prisma.invite
      .findFirst(data)
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaGameService.findInvite error reason: ' + e.message + ' code: ' + e.code,
        );
        throw new NotFoundException();
      });;
  }

  async updateInvite(data: Prisma.InviteUpdateArgs): Promise<any> {
    return await this.prisma.invite
      .update(data)
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaGameService.updateInvite error reason: ' + e.message + ' code: ' + e.code,
        );
        throw new NotFoundException();
      });;
  }

  async findGame(dto: findGameDto): Promise<GameInfo> {
    let games: GameInfo[] = null;
    try {
      games = await this.prisma.gameInfo
        .findMany({
          where: { OR: [{ p1: dto.userId }, { p2: dto.userId }], AND: [{ OR: [{ state: "PENDING" }, { state: "IN_PROGRESS" }] }] },
        })
        .catch((e: Prisma.PrismaClientKnownRequestError) => {
          // console.error('PrismaGameService.findGame error reason: ' + e.message + ' code: ' + e.code);
          throw new NotFoundException();
        });
    } catch (error) {
      // console.log("Game not found");
    }
    return games[0];
  }

  async findGameById(dto: findGameByIdDto): Promise<GameInfo> {
    let game: GameInfo = null;
    try {
      game = await this.prisma.gameInfo
        .findUniqueOrThrow({
          where: { id: dto.gameId },
        })
        .catch((e: Prisma.PrismaClientKnownRequestError) => {
          console.error('PrismaGameService.findGame error reason: ' + e.message + ' code: ' + e.code);
          throw new NotFoundException();
        });
    } catch (error) {
      console.log("Game not found");
    }
    return game;
  }

  async updateGame(game: GameInfo): Promise<boolean> {
    await this.prisma.gameInfo
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

  async searchGame(): Promise<GameInfo> {
    const game: GameInfo[] = await this.prisma.gameInfo
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

  async updateEndGame(data: Prisma.GameInfoUpdateArgs): Promise<GameInfo> {
    const game: GameInfo = await this.prisma.gameInfo
      .update(data)
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaGameService.updateEndGame error reason: ' + e.message + ' code: ' + e.code,
        );
        throw new InternalServerErrorException();
      });
    return game;
  }

  async getMatchHistory(userId: number): Promise<any> {
    const games: GameInfo[] = await this.prisma.gameInfo
      .findMany({
        where: { OR: [{ p1: userId }, { p2: userId }], AND: [{ state: "FINISHED" }] },
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error('PrismaGameService.getMatchHistory error reason: ' + e.message + ' code: ' + e.code);
        throw new InternalServerErrorException();
      });
    return games;
  }

  async get_games_in_progress(userId: number): Promise<any> {
    const games: GameInfo = await this.prisma.gameInfo
      .findFirst({
        where: { OR: [{ p1: userId }, { p2: userId }], AND: [{ state: "IN_PROGRESS" }] },
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error('PrismaGameService.getMatchHistory error reason: ' + e.message + ' code: ' + e.code);
        throw new InternalServerErrorException();
      });
    return games;
  }
}
