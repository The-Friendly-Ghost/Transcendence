import * as Matter from 'matter-js';
import Game from './gamelogic';
// import PlayerInput from './input';

export class PlayerInput {
    user: number;
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;

    constructor(user: number) {
        this.user = user;
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }

    setInput(input: any): void {
        this.up = input.up;
        this.down = input.down;
        this.left = input.left;
        this.right = input.right;
    }
}

export default class inputHandler {
    p1Input: PlayerInput;
    p2input: PlayerInput;
    game: Game;

    constructor(game: Game) {
        this.p1Input = new PlayerInput(game.player1);
        this.p2input = new PlayerInput(game.player2);
        this.game = game;
    };

    update(): void {
        let pos1: Matter.Vector = this.game.paddle1.body.position;
        let pos2: Matter.Vector = this.game.paddle2.body.position;
    };

    updateInput(input: any): void {
        if (input.user == this.game.player1) {
            this.p1Input.setInput(input);
        }
        if (input.user == this.game.player2) {
            this.p2input.setInput(input);
        }
    };

    init(): void {
    };
}
