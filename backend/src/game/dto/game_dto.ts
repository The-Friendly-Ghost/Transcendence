import Matter from 'matter-js';
import Player from '../gamelogic/player';

export class queueGameDto {
  userId: number;
  destination: string;
}

export class findGameDto {
  userId: number;
}

export class findGameByIdDto {
  gameId: number;
}

export class updateGameScoreDto {
  gameId: number;
  score: number[];
}

export class paddleDto {
  pos: Matter.Vector;
  angle: number;
}

export class ballDto {
  pos: Matter.Vector;
  vel: Matter.Vector;
}

export class gameStateDto {
  ball: ballDto;
  p1: paddleDto;
  p2: paddleDto;
};
