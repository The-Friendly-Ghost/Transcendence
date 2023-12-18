import * as THREE from 'three';
import * as Matter from 'matter-js';
import Game from './game';
// import * as CANNON from 'cannon-es';

export default class Ball {
    game: Game;
    mesh: THREE.Mesh;
    body: Matter.Body;
    engine: Matter.Engine;
    ballspeed: number;
    dir: Matter.Vector;
    light: THREE.PointLight;
    position: Matter.Vector;
    // public body: CANNON.Body;

    public constructor(game: Game) {
        this.game = game;
        this.ballspeed = game.settings.ballBaseSpeed;

        //THREEJS (Render)
        var radius = 0.5;
        var position = new THREE.Vector3(0, 0, 0);
        const material = new THREE.MeshStandardMaterial({
            color: this.game.settings.ballColor,
            metalness: 0.0,
            roughness: 1,
        })
        const geometry = new THREE.SphereGeometry(radius, 32, 16);
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.mesh.castShadow = true;
        this.game.scene.add(this.mesh);

        // White point light in the center of the ball
        this.light = new THREE.PointLight(0xff0000, 3, 0);
        this.light.castShadow = true
        this.light.shadow.mapSize.set(1024, 1024)
        this.light.shadow.camera.far = 40
        this.light.position.copy(this.mesh.position);
        this.game.scene.add(this.light)

        // MatterJS (Physics)
        this.body = Matter.Bodies.circle(position.x * 10, position.y * 10, radius * 10);
        // this.body.mass = 100;
        this.body.friction = 0;
        this.body.frictionAir = 0;
        this.body.frictionStatic = 0;
        this.body.restitution = 1;
        this.engine = game.engine;
        this.body.label = "ball";

        Matter.Events.on(this.engine, 'collisionStart', this.getReflection.bind(this));
        Matter.Composite.add(this.engine.world, this.body);

        // Game stuff
        this.position = Matter.Vector.create(position.x * 10, position.y * 10);
    };

    public update(): void {
        this.mesh.position.set(this.body.position.x / 10, this.body.position.y / 10, 0);
        this.light.position.set(this.body.position.x / 10, this.body.position.y / 10, 0);
        this.position = Matter.Vector.mult(this.body.position, 0.1);
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
        this.mesh.position.set(pos.x, 0, pos.y);
        this.light.position.set(pos.x, 0, pos.y);
        Matter.Body.setPosition(this.body, pos);
    };

    setVelocity(vec: Matter.Vector): void {
        Matter.Body.setVelocity(this.body, vec);
    };

};
