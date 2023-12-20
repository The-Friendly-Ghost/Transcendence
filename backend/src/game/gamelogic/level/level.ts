// import * as THREE from 'three';
import * as Matter from 'matter-js';
import Settings from '../settings';
import Game from '../gamelogic.js';

export default class Level {
    game: Game;
    // scene: THREE.Scene;
    floor: Matter.Body;
    ceiling: Matter.Body;
    engine: Matter.Engine;
    settings: Settings;

    constructor(game: Game) {
        this.game = game;
        // this.scene = this.game.scene;
        this.engine = this.game.engine;
        this.settings = this.game.settings;

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
