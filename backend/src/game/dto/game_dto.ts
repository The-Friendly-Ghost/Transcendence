export class gameDto {
  destination: string;
  msg: string;
}

export class findGameDto {
  gameId: number;
}

export class updateGameScoreDto {
  gameId: number;
  score: number[];
}

