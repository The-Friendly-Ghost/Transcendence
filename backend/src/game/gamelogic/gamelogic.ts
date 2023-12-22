
import * as Matter from 'matter-js';
// import Time from './utils/time';
import Player from './player';
import Ball from './ball';
import Paddle from './paddle';
import Settings from './settings';
import Level from './level/level';
import InputHandler from './input';

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

export default class Game {
    player1: number;
    player2: number;
    settings: Settings;
    ball: Ball;
    paddle1: Paddle;
    paddle2: Paddle;
    // time: Time;
    level: Level;
    engine: Matter.Engine;
    input: InputHandler;
    p1_points: number;
    p2_points: number;
    paused: boolean;


    constructor(p1: number, p2: number, settings: Settings) {
        this.paused = true;
        this.player1 = p1;
        this.player2 = p2;
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
        // this.time = new Time();
        // this.time.on('tick', this.update.bind(this));

        this.ball = new Ball(this, Matter.Vector.create(0, 0));
        // paddle 1
        this.paddle1 = new Paddle(
            this, Matter.Vector.create(this.settings.fieldWidth / 2, 0));

        // paddle 2
        this.paddle2 = new Paddle(
            this, Matter.Vector.create((-this.settings.fieldWidth / 2), 0));

        // this.time.tick();
        console.log('game created');
    };

    update_logic(deltaTime: number): void {
        if (!this.paused) {
            this.input.update();
            Matter.Engine.update(this.engine, deltaTime);
        }
        this.ball.update();
        this.paddle1.update();
        this.paddle2.update();
        if (this.ball.position.x > (this.settings.fieldWidth / 2 + 1)) {
            this.score(1);
            this.reset();
            this.countdown();
        }
        else if (this.ball.position.x < (-this.settings.fieldWidth / 2 - 1)) {
            this.score(2);
            this.reset();
            this.countdown();
        }
    }


    update(deltaTime: number): void {
        this.update_logic(deltaTime);
    }

    start(): void {
        let velocity: Matter.Vector = Matter.Vector.normalise(Matter.Vector.create(((Math.random() - 0.5) * 2), ((Math.random() - 0.5) * 2)));
        this.ball.setVelocity(Matter.Vector.mult(velocity, this.settings.ballBaseSpeed));
        this.paused = false;
    };

    reset(): void {
        this.ball.setPos(Matter.Vector.create(0, 0));
        this.ball.ballspeed = this.settings.ballBaseSpeed;
        this.paddle1.reset();
        this.paddle2.reset();
        this.ball.setVelocity(Matter.Vector.create(0, 0));
        this.paused = true;
    };

    countdown(): void {
        let count: number = 3;
        let countDown: any = setInterval(() => {
            console.log(count);
            count -= 1;
            if (count < 0) {
                clearInterval(countDown);
                this.start();
            }
        }, 1000);
    };

    score(who: number): void {
        if (who == 1)
            this.p1_points += 1;
        else if (who == 2)
            this.p2_points += 1;
        if (this.p1_points == 3) {
            console.log('player2 wins! game over');
            this.p1_points = 0;
        }
        else if (this.p2_points == 3) {
            console.log('player2 wins! game over');
            this.p2_points = 0;
        }
        console.log('score: p1: ' + this.p1_points + ' p2: ' + this.p2_points);
    };
};
