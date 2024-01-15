
import * as Matter from 'matter-js';
// import Time from './utils/time';
import Player from './player';
import Ball from './ball';
import Paddle from './paddle';
import Settings from './settings';
import Level from './level/level';
import InputHandler from './input';
import { gameStateDto } from '../dto';
import { EventEmitter } from 'stream';
import Time from './utils/time';

/*
The game class should only have the logic.
Then the client should have the visuals along with the logic.

The client could extend the game class and add the visuals.
It could also have a reference to the game class and use that to get the logic.

The game should also run on the server.
Then sync the game state to the client.
We need game settings and client settings.
Client-server game architecture which can be summarized as follows:
Server gets inputs from all the clients, with timestamps
Server processes inputs and updates world status
Server sends regular world snapshots to all clients
Client sends input and simulates their effects locally
Client get world updates and
Syncs predicted state to authoritative state
Interpolates known past states for other entities
From a player’s point of view, this has two important consequences:
Player sees himself in the present
Player sees other entities in the past
*/

export default class Game extends EventEmitter {
    state: gameStateDto;
    player1: number;
    player2: number;
    settings: Settings;
    ball: Ball;
    paddle1: Paddle;
    paddle2: Paddle;
    time: Time;
    level: Level;
    engine: Matter.Engine;
    input: InputHandler;
    p1_points: number;
    p2_points: number;
    lastScored: number;
    paused: boolean;

    constructor(p1: number, p2: number, settings: Settings) {
        super();
        this.paused = true;
        this.player1 = p1;
        this.player2 = p2;
        this.lastScored = p1;
        this.settings = settings;
        this.input = new InputHandler(this);
        this.p1_points = 0;
        this.p2_points = 0;
        // MatterJS physics
        this.engine = Matter.Engine.create();
        this.engine.gravity.y = 0;
        // Level
        this.level = new Level(this);
        // Time tick event
        this.time = new Time();
        this.time.on('tick', this.update.bind(this));
        // Ball
        this.ball = new Ball(this, Matter.Vector.create(0, 0));
        // paddle 1
        this.paddle1 = new Paddle(
            this, Matter.Vector.create(this.settings.fieldWidth / 2, 0));
        // paddle 2
        this.paddle2 = new Paddle(
            this, Matter.Vector.create((-this.settings.fieldWidth / 2), 0));
        // Misc
        this.time.tick();
        console.log('game created');
    };

    update_logic(deltaTime: number): void {
        if (!this.paused) {
            this.input.update();
            Matter.Engine.update(this.engine, deltaTime);
            this.ball.update();
            this.paddle1.update();
            this.paddle2.update();
        }
        if (this.ball.position.x > (this.settings.fieldWidth / 2 + 1)) {
            this.score(2);
        }
        else if (this.ball.position.x < (-this.settings.fieldWidth / 2 - 1)) {
            this.score(1);
        }
    }

    update(deltaTime: number): void {
        this.emit('update');
        this.update_logic(this.time.delta);
        this.update_state();
    }

    update_state(): void {
        // Add your code here to update the game state
        this.state = {
            ball: {
                pos: this.ball.position,
                vel: this.ball.getVelocity()
            },
            p1: {
                pos: this.paddle1.getPos(),
                angle: this.paddle1.getAngle()
            },
            p2: {
                pos: this.paddle2.getPos(),
                angle: this.paddle2.getAngle()
            }
        };
    }

    start(): void {
        this.emit('start');
        this.ball.start();
        this.paused = false;
    };

    reset(): void {
        this.emit('reset');
        this.ball.setPos(Matter.Vector.create(0, 0));
        this.ball.speed = this.settings.ballBaseSpeed;
        this.ball.setVelocity(Matter.Vector.create(0, 0));
        this.paddle1.reset();
        this.paddle2.reset();
        this.paused = true;
    };

    gameOver(): void {
        this.emit('gameOver');
        this.reset();
        this.p1_points = 0;
        this.p2_points = 0;
        this.paused = true;
    }

    countdown(count: number): void {
        let countDown: any = setTimeout(() => {
            console.log(count);
            count -= 1;
            if (count < 0) {
                this.start();
            }
            else {
                this.countdown(count);
            }
        }, 1000);
    };

    score(side: number): void {
        if (side == 1) {
            this.p1_points += 1;
            this.lastScored = this.player1;
        }
        else if (side == 2) {
            this.p2_points += 1;
            this.lastScored = this.player2;
        }
        this.emit('score');
        if (this.p1_points == 3) {
            console.log('player2 wins! game over');
            this.gameOver();
        }
        else if (this.p2_points == 3) {
            console.log('player2 wins! game over');
            this.gameOver();
        }
        else {
            this.reset();
            setTimeout(() => {
                this.emit('countdown');
                this.countdown(3);
            }, 1000);
        }
        console.log('score: p1: ' + this.p1_points + ' p2: ' + this.p2_points);
    };

    stop(): void {
        // this.emit('stop');
        this.paused = true;
        this.time.stop();
    }

    cleanup(): void {
        // this.emit('cleanup');
        this.stop();
        this.input.cleanup();
        this.ball.cleanup();
        this.paddle1.cleanup();
        this.paddle2.cleanup();
        this.level.cleanup();
        Matter.World.clear(this.engine.world, false);
    }
};
