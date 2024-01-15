import * as THREE from 'three';
import * as Matter from 'matter-js';
import Settings from '../settings.ts';
import Game from '../game.ts';

export default class Level {
    game: Game;
    scene: THREE.Scene;
    floor: Matter.Body;
    ceiling: Matter.Body;
    engine: Matter.Engine;
    settings: Settings;

    constructor(game: Game) {
        this.game = game;
        this.scene = this.game.scene;
        this.engine = this.game.engine;
        this.settings = this.game.settings;

        // Lights
        const light: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 0.9); // soft yellow white light
        this.scene.add(light);

        // White directional light at half intensity shining from the top.
        const dL1 = new THREE.DirectionalLight(0x0000ff, 0.3);
        dL1.castShadow = true
        dL1.shadow.mapSize.set(1024, 1024)
        dL1.shadow.camera.far = 40
        dL1.shadow.camera.left = - 20
        dL1.shadow.camera.top = 20
        dL1.shadow.camera.right = 20
        dL1.shadow.camera.bottom = - 20
        dL1.position.set(10, 10, 20)
        this.scene.add(dL1)
        const dL2 = new THREE.DirectionalLight(0xff0000, 0.3);
        dL2.castShadow = true
        dL2.shadow.mapSize.set(1024, 1024)
        dL2.shadow.camera.far = 40
        dL2.shadow.camera.left = - 20
        dL2.shadow.camera.top = 20
        dL2.shadow.camera.right = 20
        dL2.shadow.camera.bottom = - 20
        dL2.position.set(-10, -10, 20)
        this.scene.add(dL2)

        // Test mesh
        const testMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ wireframe: true })
        );
        this.scene.add(testMesh);

        // Field / plane
        const planeMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
            color: this.game.settings.fieldColor,
            metalness: 0.2,
            roughness: 0.5,
        });
        const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(this.game.settings.fieldWidth, this.game.settings.fieldHeight);
        const plane: THREE.Mesh = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(0, 0, -1);
        // plane.rotateX(-Math.PI * 0.5);
        plane.receiveShadow = true;
        this.scene.add(plane);

        // Walls
        const topWallMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
            color: this.game.settings.wallColor,
            metalness: 0.3,
            roughness: 0.4,
        });
        const topWallGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(this.game.settings.fieldWidth, 1, 2);
        const topWall: THREE.Mesh = new THREE.Mesh(topWallGeometry, topWallMaterial);
        topWall.position.set(0, - this.game.settings.fieldHeight / 2 - .5, -0.5);
        topWall.castShadow = true;
        this.scene.add(topWall);

        const bottomWallMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
            color: this.game.settings.wallColor,
            metalness: 0.3,
            roughness: 0.4,
        });
        const bottomWallGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(this.game.settings.fieldWidth, 1, 2);
        const bottomWall: THREE.Mesh = new THREE.Mesh(bottomWallGeometry, bottomWallMaterial);
        bottomWall.position.set(0, this.game.settings.fieldHeight / 2 + .5, -0.5);
        bottomWall.castShadow = true;
        this.scene.add(bottomWall);

        // Physics
        // Floor
        this.floor = Matter.Bodies.rectangle(
            0,
            (this.settings.fieldHeight / 2 + .5) * 10,
            this.settings.fieldWidth * 10,
            10,
            { isStatic: true }
        );
        Matter.Composite.add(this.engine.world, this.floor);
        // Ceiling
        this.ceiling = Matter.Bodies.rectangle(
            0,
            -(this.settings.fieldHeight / 2 + .5) * 10,
            this.settings.fieldWidth * 10,
            10,
            { isStatic: true }
        );
        Matter.Composite.add(this.engine.world, this.ceiling);


    }
}
