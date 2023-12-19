// import * as THREE from 'three';
import Game from './gamelogic.js';
import * as Matter from 'matter-js';
import Settings from './settings';

export default class Paddle {
    game: Game;
    body: Matter.Body;
    desiredPos: Matter.Vector;
    desiredAngle: number;
    startPos: Matter.Vector;
    settings: Settings;

    constructor(game: Game, startPos: Matter.Vector) {
        // Game stuff
        this.game = game;
        this.settings = game.settings;

        this.desiredPos = startPos;
        this.desiredAngle = 0;
        // this.startPos = Matter.Vector.create(0, 0);
        this.startPos = startPos;
        // this.startPos.x = 0;
        // this.startPos.y = 0;

        this.body = this.create_body(Matter.Vector.create(this.settings.paddleWidth, this.settings.paddleHeight), this.startPos);
    };

    public update(): void {
        Matter.Body.setVelocity(this.body, Matter.Vector.mult(Matter.Vector.sub(this.desiredPos, this.body.position), 0.1));
        Matter.Body.setAngle(this.body, this.desiredAngle + this.body.angle * 0.9);
    };

    create_body(dimensions: Matter.Vector, position: Matter.Vector): Matter.Body {
        // MatterJS (Physics) Body. Also add to world.
        let body = Matter.Bodies.rectangle(position.x * 10, position.y * 10, dimensions.x * 10, dimensions.y * 10, { isStatic: false });
        body.mass = 0.1;
        body.friction = 1;
        body.frictionAir = 0.1;
        body.frictionStatic = 0;
        body.restitution = 1;
        body.label = "paddle";
        Matter.Composite.add(this.game.engine.world, body);
        return body;
    };

    reset(): void {
        this.setPos(this.startPos);
        this.setAngle(0);
        this.update();
        // this.update_visuals();
    };

    setPos(pos: Matter.Vector): void {
        Matter.Body.setPosition(this.body, Matter.Vector.mult(pos, 10));
        this.desiredPos = Matter.Vector.mult(pos, 10);
        // this.mesh.position.set(pos.x, 0, pos.y);
    };

    setStartPos(pos: Matter.Vector): void {
        this.startPos = pos;
    };

    setAngle(angle: number): void {
        Matter.Body.setAngle(this.body, angle);
        this.desiredAngle = angle;
    };
};
