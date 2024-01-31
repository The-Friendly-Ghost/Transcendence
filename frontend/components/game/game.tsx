"use client"
import React, { use, useEffect, useRef, useState } from 'react'
import * as THREE from 'three';
import * as Matter from 'matter-js';
import Sizes from './utils/sizes';
import Time from './utils/time';
import Camera from './camera';
import Renderer from './renderer';
// import Player from './player';
import Ball from './ball';
import Paddle from './paddle';
import Settings from './settings';
import Level from './level';
import UserInput from './input';
import { Socket } from 'socket.io-client';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';
import Text from './text';
// import GUI from 'lil-gui';

interface GameComponentProps {
    user: string | null;
    socket: Socket | null;
    gameRoom: number | null;
}

function GameComponent({ user, socket, gameRoom }: GameComponentProps) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [game, setGame] = useState<Game | null>(null);
    const settings = new Settings();

    // Setup game if canvasRef is set and game is not set yet
    // This is also done to start the rendering.
    useEffect(() => {
        if (canvasRef.current && !game) {
            console.log('creating game');
            setGame(new Game(canvasRef.current, settings));
        }
    }, [canvasRef, settings]);

    // Setup game socket if game is set and socket is set
    useEffect(() => {
        if (game && socket)
        {
            console.log('setting game socket');
            game.setSocket(socket);
        }
    }, [socket, game]);

    // Setup game user if game is set and user is set
    useEffect(() => {
        if (user && game)
        {
            console.log('user: ' + user);
            game.setUser(user);
        }
    }, [user, game]);

    // Setup game room if game is set and gameRoom is set
    useEffect(() => {
        if (game && user && socket && gameRoom) {
            console.log('setting game room');
            game.setGameRoom(gameRoom);
            console.log("current game room: " + game.gameRoom);
        }
    }, [game, user, socket, gameRoom]);

    // Start game if game is set
    useEffect(() => {
        if (game)
            game.start();
    }, [game]);

    return (
        < canvas ref={canvasRef} />
    );
}

export default GameComponent;

/*
The game class should only have the logic.
Then the client should have the visuals along with the logic.

The client could extend the game class and add the visuals.
It could also have a reference to the game class and use that to get the logic.

The game should also run on the server.
Then sync the game state to the client.
We need game settings and client settings.

Client-server game architecture which can be summarized as follows:

Server gets inputs from all the clients, with timestamps

Server processes inputs and updates world status

Server sends regular world snapshots to all clients

Client sends input and simulates their effects locally

Client get world updates and

Syncs predicted state to authoritative state

Interpolates known past states for other entities

From a player’s point of view, this has two important consequences:

Player sees himself in the present

Player sees other entities in the past
*/

export class Game {
    // player1: Player;
    // player2: Player;
    user: string | null;
    gameRoom: number;
    socketData: any;
    canvas: HTMLCanvasElement;
    socket: Socket | null;
    settings: Settings;
    camera: Camera;
    renderer: Renderer;
    scene: THREE.Scene;
    ball: Ball;
    paddle1: Paddle;
    paddle2: Paddle;
    environmentMapTexture: any;
    sizes: Sizes;
    time: Time;
    level: Level;
    engine: Matter.Engine;
    input: UserInput;
    // gui: GUI;
    p1_points: number;
    p2_points: number;
    paused: boolean;
    font: Font | null;
    text: Text;
    scoreText1: Text;
    scoreText2: Text;


    constructor(canvas: HTMLCanvasElement, settings: Settings) {
        this.paused = true;
        // this.player1 = p1;
        // this.player2 = p2;
        this.user = null;
        this.gameRoom = 0;
        this.socket = null;
        this.settings = settings;
        this.canvas = canvas;
        this.input = new UserInput(this);
        // resize event
        this.sizes = new Sizes();
        this.sizes.on('resize', () => {
            this.resize();
        });
        this.p1_points = 0;
        this.p2_points = 0;
        // Scene
        this.scene = new THREE.Scene();
        // Camera
        this.camera = new Camera(this);
        // Renderer
        this.renderer = new Renderer(this);
        // MatterJS physics
        this.engine = Matter.Engine.create();
        this.engine.gravity.y = 0;
        // Level
        this.level = new Level(this);
        // Time tick event
        this.time = new Time();
        this.time.on('tick', this.update.bind(this));
        // Ball
        this.ball = new Ball(this);
        // this.level.spotLight1.target = this.ball.mesh;
        // this.level.spotLight2.target = this.ball.mesh;


        // paddle 1
        this.paddle1 = new Paddle(
            this,
            new THREE.Vector3(this.settings.paddleWidth, this.settings.paddleHeight, 10),
            new THREE.Vector3(- this.settings.fieldWidth / 2, 0, 0)
        );

        // paddle 2
        this.paddle2 = new Paddle(
            this,
            new THREE.Vector3(this.settings.paddleWidth, this.settings.paddleHeight, 10),
            new THREE.Vector3(this.settings.fieldWidth / 2, 0, 0)
        );

        // this.setGameRoom(this.gameRoom);

        // loaders
        this.font = null;
        const fontLoader = new FontLoader()
        fontLoader.load(
            '/fonts/helvetiker_regular.typeface.json',
            (font) => {
                this.font = font
                this.text = new Text({
                    font: this.font,
                    scene: this.scene,
                    text: 'Waiting for other players...',
                    color: new THREE.Color(0xffffff),
                    position: new THREE.Vector3(0, 20, 10)
                });
                this.scoreText1 = new Text({
                    font: this.font,
                    scene: this.scene,
                    text: 'score: 0',
                    color: new THREE.Color(0xffffff),
                    position: new THREE.Vector3(-this.settings.fieldWidth / 3, this.settings.fieldHeight / 3 - 20, 1)
                });
                this.scoreText2 = new Text({
                    font: this.font,
                    scene: this.scene,
                    text: 'score: 0',
                    color: new THREE.Color(0xffffff),
                    position: new THREE.Vector3(this.settings.fieldWidth / 3, this.settings.fieldHeight / 3 - 20, 1)
                });
            }
        )
        this.time.tick();
    };

    update_logic(): void {
        if (!this.paused) {
            // this.input.update();
            Matter.Engine.update(this.engine, this.time.delta);
        }
        this.ball.update();
        this.paddle1.update_logic();
        this.paddle2.update_logic();
        // if (this.ball.position.x > this.settings.fieldWidth / 2 + 1) {
        //     this.score(1);
        //     this.reset();
        //     // this.countdown();
        // }
        // else if (this.ball.position.x < -this.settings.fieldWidth / 2 - 1) {
        //     this.score(2);
        //     this.reset();
        //     // this.countdown();
        // }
    }

    update_visuals(): void {
        this.camera.update();
        this.renderer.update();
        this.paddle1.update_visuals();
        this.paddle2.update_visuals();
        this.ball.update_visuals();
    }


    update(): void {
        this.input.update();
        this.update_logic();
        this.update_visuals();
    }

    removeListeners(): void {
        this.socket?.off('gameUpdate');
        this.socket?.off('gameStart');
        this.socket?.off('gameStatus');
        this.socket?.off('gameReset');
        this.socket?.off('playerScored');
        this.socket?.off('playerLeft');
        this.socket?.off('countdown');
    }

    setListeners(): void {
        console.log('setting up game listeners');
        console.log(this.socket);
        this.socket?.on('gameUpdate', (state: any) => {
            console.log(state);
            // console.log(data.message);
            this.ball.setPos(state.ball.pos);
            this.ball.setVelocity(state.ball.vel);
            this.paddle1.setPos(state.p1.pos);
            this.paddle2.setPos(state.p2.pos);
            this.paddle1.setAngle(state.p1.angle);
            this.paddle2.setAngle(state.p2.angle);
        });
        this.socket?.on('gameStart', (data: any) => {
                console.log(data);
                this.countdown(3);
                // this.start();
        });
        this.socket?.on('gameStatus', (data: any) => {
                console.log(data);
                if (data.message == 'FINISHED') {
                    this.text.setText("Game over!");
                    this.removeListeners();
                    console.log('game has ended. finito. finished');
                }
            });
            this.socket?.on('gameReset', (data: any) => {
                console.log(data);
                this.reset();
                this.countdown(3);
            });
            this.socket?.on('playerScored', (data: any) => {
                console.log(data);
                if (data.player == this.user) {
                    this.text.setText("You scored!");
                }
                else {
                    this.text.setText("Opponent scored!");
                }
                this.text.setVisibility(true);
                this.scoreText1.setText('score: ' + data.p1_points);
                this.scoreText2.setText('score: ' + data.p2_points);
                // this.score(data);
            });
            this.socket?.on('playerLeft', (data: any) => {
                console.log(data);
                // this.removeListeners();
                // console.log('player left. game over');
            });
            this.socket?.on('countdown', (data: any) => {
                console.log(data);
                this.countdown(data.count);
            });
        };

    setGameRoom(gameRoom: number): void {
        this.removeListeners();
        this.gameRoom = gameRoom;
        this.setListeners();
    }

    resize(): void {
        this.camera.resize();
        this.renderer.resize();
    }

    start(): void {
        if (this.text)
            this.text.setVisibility(false);
        this.paused = false;
    };

    reset(): void {
        this.ball.setPos(Matter.Vector.create(0, 0));
        this.ball.ballspeed = this.settings.ballBaseSpeed;
        this.paddle1.reset();
        this.paddle2.reset();
        this.ball.setVelocity(Matter.Vector.create(0, 0));
        this.paused = true;
    };

    countdown(count: number): void {
        let countDown: any = setTimeout(() => {
            console.log(count);
            if (this.text) {
                this.text.setVisibility(true);
                this.text.setPosition(new THREE.Vector3(0, 50, 30));
                this.text.setText(String(count));
            }
            count -= 1;
            if (count < 0) {
                this.start();
            }
            else
                this.countdown(count);
        }, 1000);
    };

    score(who: number): void {
        if (who == 1)
            this.p1_points += 1;
        else if (who == 2)
            this.p2_points += 1;
        if (this.p1_points == 3) {
            console.log('player2 wins! game over');
            this.p1_points = 0;
        }
        else if (this.p2_points == 3) {
            console.log('player2 wins! game over');
            this.p2_points = 0;
        }
        console.log('score: p1: ' + this.p1_points + ' p2: ' + this.p2_points);
    };

    setUser(user: string): void {
        this.user = user;
    };

    setSocket(socket: Socket): void {
        this.socket = socket;
    };
};
