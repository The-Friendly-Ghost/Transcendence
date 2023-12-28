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

export default class InputHandler {
    p1Input: PlayerInput;
    p2Input: PlayerInput;
    game: Game;

    constructor(game: Game) {
        this.p1Input = new PlayerInput(game.player1);
        this.p2Input = new PlayerInput(game.player2);
        this.game = game;
    };

    update(): void {
        let pos1: Matter.Vector = this.game.paddle1.body.position;
        let pos2: Matter.Vector = this.game.paddle2.body.position;

        if (this.p1Input.up) {
            // console.log("up");
            this.game.paddle1.desiredPos.y += this.game.settings.paddleSpeed;
        }
        if (this.p1Input.down) {
            this.game.paddle1.desiredPos.y -= this.game.settings.paddleSpeed;
        }
        if (this.p2Input.up) {
            this.game.paddle2.desiredPos.y += this.game.settings.paddleSpeed;
        }
        if (this.p2Input.down) {
            this.game.paddle2.desiredPos.y -= this.game.settings.paddleSpeed;
        }
    };

    updateInput(input: any): void {
        if (input.user == this.game.player1) {
            this.p1Input.setInput(input);
        }
        if (input.user == this.game.player2) {
            this.p2Input.setInput(input);
        }
    };

    init(): void {
    };
}
