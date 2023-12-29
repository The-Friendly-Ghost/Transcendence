export interface paddleDto {
    pos: Matter.Vector;
    angle: number;
}

export interface ballDto {
    pos: Matter.Vector;
    vel: Matter.Vector;
}

export interface gameStateDto {
    ball: ballDto;
    p1: paddleDto;
    p2: paddleDto;
};
