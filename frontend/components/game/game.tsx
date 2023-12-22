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
import Level from './level/level';
import UserInput from './input';
import { Socket } from 'socket.io-client';
// import GUI from 'lil-gui';

interface GameComponentProps {
    user: string | null;
    socket: Socket | null;
    gameRoom: number | null;
}

function GameComponent({ user, socket, gameRoom }: GameComponentProps) {

    const gameSocketRef = useRef<Socket | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [game, setGame] = useState<Game | null>(null);
    const settings = new Settings();

    useEffect(() => {
        console.log('user: ' + user + ' socket: ' + socket + ' gameRoom: ' + gameRoom);
        if (canvasRef.current && !game && user && socket && gameRoom) {
            console.log('creating game');
            setGame(new Game(canvasRef.current, settings, user, socket, gameRoom));
        }
        if (game && user && socket && gameRoom) {
            game.setGameRoom(gameRoom);
        }
    }, [canvasRef, game, settings, user, socket, gameRoom]);

    // useEffect(() => {
    //     console.log('gameRoom: ' + gameRoom);
    //     console.log('socket: ' + socket);
    // }, [socket, gameRoom, game]);

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
    user: string;
    gameRoom: number;
    socketData: any;
    canvas: HTMLCanvasElement;
    socket: Socket;
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

    constructor(canvas: HTMLCanvasElement, settings: Settings, user: string, socket: Socket, gameRoom: number) {
        this.paused = true;
        // this.player1 = p1;
        // this.player2 = p2;
        this.user = user;
        this.gameRoom = gameRoom;
        this.socket = socket;
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
        this.ball = new Ball(this,);

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

        this.setGameRoom(this.gameRoom);

        // this.gui = new GUI();
        // this.gui.add(this, 'reset');
        // this.gui.add(this.settings, 'ballBaseSpeed');
        // this.gui.add(this.settings, 'ballSpeedMultiplier');
        // this.gui.add(this, 'start');
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
        // this.update_logic();
        this.update_visuals();
    }

    setGameRoom(gameRoom: number): void {
        this.gameRoom = gameRoom;
        this.socket.on(String(gameRoom), (data: any) => {
            // console.log(data);
            if (data.messagetype == 'gameUpdate') {
                console.log(data.message);
                this.ball.setPos(data.message.ballpos);
                this.paddle1.setPos(data.message.p1.pos);
                this.paddle2.setPos(data.message.p2.pos);
                this.paddle1.setAngle(data.message.p1.angle);
                this.paddle2.setAngle(data.message.p2.angle);
            }
        });
    }

    resize(): void {
        this.camera.resize();
        this.renderer.resize();
    }

    start(): void {
        let velocity: Matter.Vector = Matter.Vector.normalise(Matter.Vector.create(((Math.random() - 0.5) * 2), (Math.random() - 0.5) * 2))
        this.ball.setVelocity(Matter.Vector.mult(velocity, this.settings.ballBaseSpeed));
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

    // countdown(): void {
    //     let count: number = 3;
    //     let countDown: any = setInterval(() => {
    //         console.log(count);
    //         count -= 1;
    //         if (count < 0) {
    //             clearInterval(countDown);
    //             this.start();
    //         }
    //     }, 1000);
    // };

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
};
