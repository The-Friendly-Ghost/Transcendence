import * as THREE from 'three';

export default class Settings {
    // field
    public fieldWidth: number = 30;
    public fieldHeight: number = 20;
    public wallColor: THREE.Color = new THREE.Color(0xdddddd);
    public fieldColor: THREE.Color = new THREE.Color(0xaaaaaa);

    // Paddles
    public paddleHeight: number = 4;
    public paddleWidth: number = 1;
    public paddleColor: THREE.Color = new THREE.Color();
    public paddleSpeed: number = 2;
    public paddleRotationSpeed: number = 0.005;

    // Camera
    public cameraDistance: number = 22;

    // Ball
    public ballColor: THREE.Color = new THREE.Color(0xff0000);

    public ballBaseSpeed: number = 1;
    public ballSpeedMultiplier: number = 0.1;

    public constructor() {
    };
};
