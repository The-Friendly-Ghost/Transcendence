// import * as THREE from 'three';
import * as Matter from 'matter-js';
import Game from './gamelogic';
// import * as CANNON from 'cannon-es';

export default class Ball {
    game: Game;
    body: Matter.Body;
    engine: Matter.Engine;
    speed: number;
    dir: Matter.Vector;
    radius: number;
    position: Matter.Vector;

    public constructor(game: Game, position: Matter.Vector) {
        this.game = game;

        // Initialize ball properties
        this.speed = game.settings.ballBaseSpeed;
        this.radius = game.settings.ballRadius;
        this.position = Matter.Vector.create(position.x, position.y);

        // MatterJS (Physics)
        this.body = Matter.Bodies.circle(this.position.x, this.position.y, this.radius);
        // this.body.mass = 100;
        this.body.friction = 0;
        this.body.frictionAir = 0;
        this.body.frictionStatic = 0;
        this.body.restitution = 1;
        this.engine = game.engine;
        this.body.label = "ball";

        Matter.Events.on(this.engine, 'collisionStart', this.reflection.bind(this));
        Matter.Composite.add(this.engine.world, this.body);
    };

    public update(): void {
        this.position = this.body.position;
    };

    public start(): void {
        this.dir = Matter.Vector.normalise(Matter.Vector.create(((Math.random() - 0.5) * 2), (Math.random() - 0.5)));
        let speed = this.calculateBallSpeed(false);
        this.speed = this.game.settings.ballBaseSpeed;
        this.setVelocity(Matter.Vector.mult(this.dir, speed));
    };

    reflection(event: any): void {
        let ball: Matter.Body;
        let coll: Matter.Collision;
        let normal: Matter.Vector;
        let other: Matter.Body;
        let currentSpeed: number;
        ball = null;
        for (let pair of this.engine.pairs.list) {
            if (pair.bodyA.label == "ball") {
                ball = pair.bodyA;
                other = pair.bodyB;
            }
            else if (pair.bodyB.label == "ball") {
                ball = pair.bodyB;
                other = pair.bodyA;
            }
            if (ball) {
                coll = pair.collision;
                normal = coll.normal;
                this.dir = this.calculateReflection(normal, Matter.Vector.normalise(ball.velocity));
                if (other.label == "paddle")
                    currentSpeed = this.calculateBallSpeed(true);
                else
                    currentSpeed = this.calculateBallSpeed(false);
                this.setVelocity(Matter.Vector.mult(this.dir, currentSpeed));
                break;
            }
        }
    };

    calculateBallSpeed(paddleCollision: boolean): number {
        let calculatedSpeed = 0;
        let extraSpeed = 0;
        extraSpeed = .3 / this.dir.x;
        if (extraSpeed < 0)
            extraSpeed = -extraSpeed;
        if (extraSpeed > 2)
            extraSpeed = 2;
        if (paddleCollision)
            this.speed += this.game.settings.ballBaseSpeed * this.game.settings.ballSpeedMultiplier;
        calculatedSpeed = extraSpeed + this.speed;
        return calculatedSpeed;
    };

    calculateReflection(normal: Matter.Vector, dir: Matter.Vector): Matter.Vector {
        let dot = Matter.Vector.dot(dir, normal);
        dir.x = dir.x - 2 * dot * normal.x;
        dir.y = dir.y - 2 * dot * normal.y;
        return dir;
    };

    setPos(pos: Matter.Vector): void {
        Matter.Body.setPosition(this.body, pos);
    };

    setVelocity(vec: Matter.Vector): void {
        Matter.Body.setVelocity(this.body, vec);
    };

    getVelocity(): Matter.Vector {
        return this.body.velocity;
    };

    cleanup(): void {
        this.game = null;
    };
};
