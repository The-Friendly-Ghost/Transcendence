"use client";
import * as THREE from 'three';
import * as Matter from 'matter-js';
import Settings from './settings';
import Game from './game';

export default class Level {
    game: Game;
    scene: THREE.Scene;
    floor: Matter.Body;
    ceiling: Matter.Body;
    engine: Matter.Engine;
    settings: Settings;
    spotLight1: THREE.SpotLight;
    spotLight2: THREE.SpotLight;

    constructor(game: Game) {
        this.game = game;
        this.scene = this.game.scene;
        this.engine = this.game.engine;
        this.settings = this.game.settings;

        // Lights
        const light: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 0.9); // soft yellow white light
        this.scene.add(light);

        // White directional light at half intensity shining from the top.
        const dL1 = new THREE.DirectionalLight(0x0000ff, 0.5);
        dL1.castShadow = true
        dL1.shadow.mapSize.set(1024, 1024)
        dL1.shadow.camera.far = 400
        dL1.shadow.camera.left = - 200
        dL1.shadow.camera.top = 200
        dL1.shadow.camera.right = 200
        dL1.shadow.camera.bottom = - 200
        dL1.position.set(100, 100, 200)
        this.scene.add(dL1)
        const dL2 = new THREE.DirectionalLight(0xff0000, 0.5);
        dL2.castShadow = true
        dL2.shadow.mapSize.set(1024, 1024)
        dL2.shadow.camera.far = 400
        dL2.shadow.camera.left = - 200
        dL2.shadow.camera.top = 200
        dL2.shadow.camera.right = 200
        dL2.shadow.camera.bottom = - 200
        dL2.position.set(-100, -100, 200)
        this.scene.add(dL2)

        // Field / plane
        const planeMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
            color: this.game.settings.fieldColor,
            metalness: 0.2,
            roughness: 0.5,
        });
        const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(this.game.settings.fieldWidth, this.game.settings.fieldHeight);
        const plane: THREE.Mesh = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(0, 0, -10);
        // plane.rotateX(-Math.PI * 0.5);
        plane.receiveShadow = true;
        this.scene.add(plane);

        // Walls
        const topWallMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
            color: this.game.settings.wallColor,
            metalness: 0.3,
            roughness: 0.4,
        });
        const topWallGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(this.game.settings.fieldWidth, 10, 20);
        const topWall: THREE.Mesh = new THREE.Mesh(topWallGeometry, topWallMaterial);
        topWall.position.set(0, - this.game.settings.fieldHeight / 2 - 5, -5);
        topWall.castShadow = true;
        this.scene.add(topWall);

        const bottomWallMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
            color: this.game.settings.wallColor,
            metalness: 0.3,
            roughness: 0.4,
        });
        const bottomWallGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(this.game.settings.fieldWidth, 10, 20);
        const bottomWall: THREE.Mesh = new THREE.Mesh(bottomWallGeometry, bottomWallMaterial);
        bottomWall.position.set(0, this.game.settings.fieldHeight / 2 + 5, -5);
        bottomWall.castShadow = true;
        this.scene.add(bottomWall);

        // Circle
        const geometry = new THREE.CircleGeometry(10, 32);
        const circleMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffffff),
            metalness: 0.3,
            roughness: 0.4,
        });
        const circle = new THREE.Mesh(geometry, circleMaterial);
        circle.position.set(0, 0, -9);
        circle.castShadow = true;
        this.game.scene.add(circle);

        // line
        const lineMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffffff),
            metalness: 0.3,
            roughness: 0.4,
        });
        const lineGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(10, this.game.settings.fieldHeight, 1);
        const line: THREE.Mesh = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.set(0, 0, -10);
        line.castShadow = true;
        this.scene.add(line);
        // // line 2
        // const line2Geometry: THREE.BoxGeometry = new THREE.BoxGeometry(this.game.settings.fieldWidth, 10, 1);
        // const line2: THREE.Mesh = new THREE.Mesh(line2Geometry, lineMaterial);
        // line2.position.set(0, this.game.settings.fieldHeight / 2 - 5, -10);
        // line2.castShadow = true;
        // this.scene.add(line2);

        // const spotLight1 = new THREE.SpotLight(0xff0000, 1000, 0, Math.PI / 8, 0, 1.1);
        // spotLight1.position.set(this.settings.fieldHeight / 2, this.settings.fieldHeight / 2, 1);
        // spotLight1.castShadow = true;
        // spotLight1.shadow.mapSize.width = 1024;
        // spotLight1.shadow.mapSize.height = 1024;
        // spotLight1.shadow.camera.near = 10;
        // spotLight1.shadow.camera.far = 4000;
        // spotLight1.shadow.camera.fov = 30;
        // // spotLight1.target = this.game.ball;
        // this.scene.add(spotLight1);
        // this.spotLight1 = spotLight1;
        // const spotLight2 = new THREE.SpotLight(0x0000ff, 1000, 0, Math.PI / 8, 0, 1.1);
        // spotLight2.position.set(-this.settings.fieldHeight / 2, -this.settings.fieldHeight / 2, 1);
        // // spotLight2.map = new THREE.TextureLoader().load( url );
        // spotLight2.castShadow = true;
        // spotLight2.shadow.mapSize.width = 1024;
        // spotLight2.shadow.mapSize.height = 1024;
        // spotLight2.shadow.camera.near = 10;
        // spotLight2.shadow.camera.far = 4000;
        // spotLight2.shadow.camera.fov = 30;
        // // spotLight2.target = this.game.ball;
        // this.scene.add(spotLight2);
        // this.spotLight2 = spotLight2;

        // Physics
        // Floor
        this.floor = Matter.Bodies.rectangle(
            0,
            (this.settings.fieldHeight / 2 + 5),
            this.settings.fieldWidth,
            10,
            { isStatic: true }
        );
        Matter.Composite.add(this.engine.world, this.floor);
        // Ceiling
        this.ceiling = Matter.Bodies.rectangle(
            0,
            -(this.settings.fieldHeight / 2 + 5),
            this.settings.fieldWidth,
            10,
            { isStatic: true }
        );
        Matter.Composite.add(this.engine.world, this.ceiling);


    }
}
