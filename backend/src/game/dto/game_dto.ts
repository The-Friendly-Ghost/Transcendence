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
