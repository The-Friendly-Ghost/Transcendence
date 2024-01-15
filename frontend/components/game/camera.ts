import Game from "./game.ts";
import Sizes from "./utils/sizes.ts";
import * as THREE from 'three';


export default class Camera {
    game: Game;
    instance: THREE.PerspectiveCamera;
    sizes: Sizes;
    scene: THREE.Scene;
    canvas: any;

    constructor(game: Game) {
        this.game = game;
        this.sizes = this.game.sizes
        this.scene = this.game.scene
        this.canvas = this.game.canvas

        // Base camera
        this.instance = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100);
        if (this.instance.aspect > 1.5) {
            this.instance.position.z = this.game.settings.cameraDistance / 1.5;
        }
        else {
            this.instance.position.z = this.game.settings.cameraDistance / this.instance.aspect;
        }
        this.instance.updateProjectionMatrix();
        // this.instance.rotateX(- Math.PI * 0.5);
        this.scene.add(this.instance);
    };

    update(): void {
        let lookVec: THREE.Vector3 = new THREE.Vector3(this.game.ball.mesh.position.x / 15, 0, 0);
        // this.instance.lookAt(lookVec);
        // this.instance.position.x = lookVec.x;
        // this.instance.
    }

    resize(): void {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        if (this.instance.aspect > 1.5) {
            this.instance.position.z = this.game.settings.cameraDistance / 1.5;
        }
        else {
            this.instance.position.z = this.game.settings.cameraDistance / this.instance.aspect;
        }
        this.instance.updateProjectionMatrix();
    };
}
