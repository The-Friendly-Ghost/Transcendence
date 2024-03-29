import * as THREE from 'three';
import Game from './game';
import * as Matter from 'matter-js';

export default class Paddle {
    game: Game;
    mesh: THREE.Mesh;
    body: Matter.Body;
    desiredPos: Matter.Vector;
    desiredAngle: number;
    startPos: Matter.Vector;

    constructor(game: Game, dimensions: THREE.Vector3, position: THREE.Vector3) {
        // Game stuff
        this.game = game;
        this.desiredPos = Matter.Vector.create(position.x, position.y);
        this.desiredAngle = 0;
        this.startPos = Matter.Vector.create(0, 0);
        this.startPos.x = position.x;
        this.startPos.y = position.y;
        this.body = this.create_body(dimensions, position);
        this.mesh = this.create_mesh(dimensions, position);
    };

    update_visuals(): void {
        this.mesh.position.set(this.body.position.x, this.body.position.y, 0);
        this.mesh.rotation.z = this.body.angle;
    };

    update_logic(): void {
        Matter.Body.setVelocity(this.body, Matter.Vector.sub(this.desiredPos, this.body.position));
        Matter.Body.setAngle(this.body, this.desiredAngle + this.body.angle * 0.9);
    };

    create_body(dimensions: THREE.Vector3, position: THREE.Vector3): Matter.Body {
        // MatterJS (Physics) Body. Also add to world.
        let body = Matter.Bodies.rectangle(position.x, position.y, dimensions.x, dimensions.y, { isStatic: false });
        body.mass = 0.1;
        body.friction = 1;
        body.frictionAir = 0.1;
        body.frictionStatic = 0;
        body.restitution = 1;
        body.label = "paddle";
        Matter.Composite.add(this.game.engine.world, body);
        return body;
    };

    create_mesh(dimensions: THREE.Vector3, position: THREE.Vector3): THREE.Mesh {
        //THREEJS Mesh. Also add to scene.
        let material = new THREE.MeshStandardMaterial({
            color: this.game.settings.paddleColor,
            metalness: 0.3,
            roughness: 0.4,
        });
        let geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.castShadow = true;
        this.game.scene.add(mesh);
        return mesh;
    };

    reset(): void {
        this.setPos(this.startPos);
        this.setAngle(0);
        this.update_logic();
        this.update_visuals();
    };

    setDesiredPos(pos: Matter.Vector): void {
        this.desiredPos = pos;
    }

    setDesiredAngle(angle: number): void {
        this.desiredAngle = angle;
    }

    setPos(pos: Matter.Vector): void {
        Matter.Body.setPosition(this.body, pos);
        this.desiredPos = pos;
        this.mesh.position.set(pos.x, pos.y, 0);
    };

    setAngle(angle: number): void {
        Matter.Body.setAngle(this.body, angle);
        this.mesh.rotation.z = angle;
        this.desiredAngle = angle;
    };
};
