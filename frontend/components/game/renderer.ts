import * as THREE from 'three';
import Camera from './camera';
import Sizes from './utils/sizes';
import Game from './game';

export default class Renderer {
    game: Game;
    canvas: HTMLCanvasElement;
    sizes: Sizes;
    scene: THREE.Scene;
    camera: Camera;
    instance: THREE.WebGLRenderer;

    constructor(game: Game) {
        this.game = game;
        this.canvas = game.canvas;
        this.sizes = game.sizes;
        this.scene = game.scene;
        this.camera = game.camera;

        // Renderer
        this.setInstance();
    }

    setInstance(): void {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.instance.useLegacyLights = false;
        this.instance.toneMapping = THREE.CineonToneMapping;
        this.instance.toneMappingExposure = 1.75;
        this.instance.outputColorSpace = THREE.LinearSRGBColorSpace;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    resize(): void {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update(): void {
        this.instance.render(this.scene, this.camera.instance)
    }

}
