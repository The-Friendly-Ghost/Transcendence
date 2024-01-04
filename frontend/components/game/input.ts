"use client";
import * as Matter from 'matter-js';
import { Game } from './game';

export default class UserInput {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    w: boolean;
    a: boolean;
    s: boolean;
    d: boolean;
    game: Game;

    constructor(game: Game) {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.w = false;
        this.a = false;
        this.s = false;
        this.d = false;
        this.game = game;
        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyUp.bind(this));
    };

    update(): void {
        // console.log("w: " + this.w + " a: " + this.a + " s: " + this.s + " d: " + this.d);
        this.game.socket?.emit('userInput', { gameRoom: this.game.gameRoom, user: this.game.user, up: this.game.input.w, down: this.game.input.s, left: this.game.input.a, right: this.game.input.d });
        let pos1: Matter.Vector = this.game.paddle1.body.position;
        let pos2: Matter.Vector = this.game.paddle2.body.position;
        // if (this.w) {
        //     console.log("w");
        //     this.game.paddle1.desiredPos.y += this.game.settings.paddleSpeed;
        // }
        // if (this.s) {
        //     this.game.paddle1.desiredPos.y -= this.game.settings.paddleSpeed;
        // }
        // if (this.a) {
        //     this.game.paddle1.desiredAngle += this.game.settings.paddleRotationSpeed;
        // }
        // if (this.d) {
        //     this.game.paddle1.desiredAngle -= this.game.settings.paddleRotationSpeed;
        // }
        // if (this.up) {
        //     this.game.paddle2.desiredPos.y += this.game.settings.paddleSpeed;
        // }
        // if (this.down) {
        //     this.game.paddle2.desiredPos.y -= this.game.settings.paddleSpeed;
        // }
        // if (this.left) {
        //     this.game.paddle2.desiredAngle += this.game.settings.paddleRotationSpeed;
        // }
        // if (this.right) {
        //     this.game.paddle2.desiredAngle -= this.game.settings.paddleRotationSpeed;
        // }
    };

    init(): void {
    };

    private keyDown(event: KeyboardEvent): void {
        // console.log(event.code);
        switch (event.code) {
            case 'ArrowUp':
                this.up = true;
                break;
            case 'ArrowDown':
                this.down = true;
                break;
            case 'ArrowLeft':
                this.left = true;
                break;
            case 'ArrowRight':
                this.right = true;
                break;
            case 'KeyW':
                this.w = true;
                break;
            case 'KeyA':
                this.a = true;
                break;
            case 'KeyS':
                this.s = true;
                break;
            case 'KeyD':
                this.d = true;
                break;
            default:
                break;
        }
    }

    private keyUp(event: KeyboardEvent): void {
        switch (event.code) {
            case 'ArrowUp':
                this.up = false;
                break;
            case 'ArrowDown':
                this.down = false;
                break;
            case 'ArrowLeft':
                this.left = false;
                break;
            case 'ArrowRight':
                this.right = false;
                break;
            case 'KeyW':
                this.w = false;
                break;
            case 'KeyA':
                this.a = false;
                break;
            case 'KeyS':
                this.s = false;
                break;
            case 'KeyD':
                this.d = false;
                break;
            default:
                break;
        }
    }
}
