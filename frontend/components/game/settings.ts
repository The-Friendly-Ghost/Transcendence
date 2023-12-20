import * as THREE from 'three';

export default class Settings {
    // field
    public fieldWidth: number = 300;
    public fieldHeight: number = 200;
    public wallColor: THREE.Color = new THREE.Color(0xdddddd);
    public fieldColor: THREE.Color = new THREE.Color(0xaaaaaa);

    // Paddles
    public paddleHeight: number = 40;
    public paddleWidth: number = 10;
    public paddleColor: THREE.Color = new THREE.Color();
    public paddleSpeed: number = 20;
    public paddleRotationSpeed: number = 0.005;

    // Camera
    public cameraDistance: number = 220;

    // Ball
    public ballColor: THREE.Color = new THREE.Color(0xff0000);

    public ballBaseSpeed: number = 10;
    public ballSpeedMultiplier: number = 0.1;

    public constructor() {
    };
};
