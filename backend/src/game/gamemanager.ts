import { GameInfo } from '@prisma/client';
import { GameGateway } from './game.gateway';
import Game from './gamelogic/gamelogic';
import Settings from './gamelogic/settings';
import { PlayerInput } from './gamelogic/input';
import { gameStateDto } from './dto';
import { from } from 'rxjs';
import { log } from 'console';
import { Socket } from 'socket.io';

export class GameManager {
    gameInfo: GameInfo;
    gateway: GameGateway;
    game: Game;
    p1Input: PlayerInput;
    p2Input: PlayerInput;
    p1Socket: Socket;
    p2Socket: Socket;
    cleanupCallback: (gameInfo: GameInfo) => void;
    startCallback: (gameInfo: GameInfo) => void;

    constructor(gameInfo: GameInfo, gateway: GameGateway, cleanupCallback: (gameInfo: GameInfo) => void, startCallback: (gameInfo: GameInfo) => void) {
        this.gameInfo = gameInfo;
        this.gateway = gateway;
        this.p1Socket = gateway.getSocket(gameInfo.p1);
        this.p2Socket = gateway.getSocket(gameInfo.p2);
        this.gameInfo.state = "IN_PROGRESS";
        this.game = new Game(gameInfo.p1, gameInfo.p2, new Settings());
        this.p1Socket.on('userInput', this.userInput.bind(this));
        this.p2Socket.on('userInput', this.userInput.bind(this));
        this.p2Socket.join(String(gameInfo.roomName));
        this.p1Socket.join(String(gameInfo.roomName));
        this.game.on('update', this.update.bind(this));
        this.game.on('gameOver', this.gameOver.bind(this));
        this.game.on('score', this.score.bind(this));
        this.game.on('countdown', this.countdown.bind(this));
        // this.game.on('startgame', this.startGame.bind(this));
        this.cleanupCallback = cleanupCallback;
        this.startCallback = startCallback;
        this.startGame();
    }


    updateClients() {
        this.gateway.updateClients(Number(this.gameInfo.roomName), this.game.state);
    }

    update() {
        this.updateClients();
    }

    gameOver() {
        this.gameInfo.state = "FINISHED";
        console.log("game over");
        this.gameInfo.score = this.game.getScore();
        this.gateway.sendToRoom(this.gameInfo.roomName, "gameStatus", this.gameInfo.state);
        this.cleanup();
    }

    startGame() {
        console.log("start game" + this.gameInfo);
        this.gateway.sendToRoom(this.gameInfo.roomName, "gameStart", "started");
        this.game.countdown(3);
        this.gameInfo.state = "IN_PROGRESS";
        this.startCallback(this.gameInfo);
    }

    userInput(body: any) {
        if (this.game)
            this.game.input.updateInput(body);
    };

    cleanup() {
        this.game.cleanup();
        this.game.removeAllListeners();
        this.p1Socket.removeAllListeners();
        this.p2Socket.removeAllListeners();
        this.p1Socket.leave(String(this.gameInfo.roomName));
        this.p2Socket.leave(String(this.gameInfo.roomName));
        this.cleanupCallback(this.gameInfo);
        this.game = null;
        this.gateway = null;
        this.gameInfo = null;
        this.p1Input = null;
        this.p2Input = null;
        this.p1Socket = null;
        this.p2Socket = null;
    }

    score(player: number) {
        // this.gameInfo.state = "SCORE";
        this.gateway.sendToRoom(this.gameInfo.roomName, "playerScored", {
            player: this.game.lastScored,
            p1_points: this.game.p1_points,
            p2_points: this.game.p2_points
        });
        // this.game.score;
    }

    countdown() {
        this.gateway.sendToRoom(this.gameInfo.roomName, "countdown", { count: 3 });
    }
}
