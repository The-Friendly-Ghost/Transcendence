// import * as THREE from 'three';
import * as Matter from 'matter-js';
import Game from './gamelogic';
// import * as CANNON from 'cannon-es';

export default class Ball {
    game: Game;
    body: Matter.Body;
    engine: Matter.Engine;
    ballspeed: number;
    dir: Matter.Vector;
    radius: number;
    position: Matter.Vector;

    public constructor(game: Game, position: Matter.Vector) {
        this.game = game;

        // Initialize ball properties
        this.ballspeed = game.settings.ballBaseSpeed;
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

        Matter.Events.on(this.engine, 'collisionStart', this.getReflection.bind(this));
        Matter.Composite.add(this.engine.world, this.body);
    };

    public update(): void {
        this.position = this.body.position;
    };

    getReflection(event: any): void {
        let ball: Matter.Body;
        let coll: Matter.Collision;
        let normal: Matter.Vector;
        let other: Matter.Body;
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
                this.dir = Matter.Vector.normalise(ball.velocity);
                let dot = Matter.Vector.dot(this.dir, normal);
                this.dir.x = this.dir.x - 2 * dot * normal.x;
                this.dir.y = this.dir.y - 2 * dot * normal.y;
                if (other.label == "paddle")
                    this.ballspeed += this.game.settings.ballBaseSpeed * this.game.settings.ballSpeedMultiplier;
                Matter.Body.setVelocity(ball, { x: this.dir.x * this.ballspeed, y: this.dir.y * this.ballspeed });
                break;
            }
        }
    };

    setReflection(event: any): void {
        let ball: Matter.Body;
        // let pairs = event.pair;
        // console.log(event);
        ball = null;
        for (let pair of this.engine.pairs.list) {
            if (pair.bodyA.label == "ball")
                ball = pair.bodyA;
            else if (pair.bodyB.label == "ball")
                ball = pair.bodyB;
            if (ball) {
                Matter.Body.setVelocity(ball, { x: this.dir.x * this.ballspeed, y: this.dir.y * this.ballspeed });
            }
        }
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
