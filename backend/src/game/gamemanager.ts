import { GameInfo } from '@prisma/client';
import { GameGateway } from './game.gateway';
import Game from './gamelogic/gamelogic';
import Settings from './gamelogic/settings';
import { PlayerInput } from './gamelogic/input';
import { gameStateDto } from './dto';
import { from } from 'rxjs';
import { log } from 'console';
// import { GameService } from './game.service';

// import * as Matter from 'matter-js';
// import Time from './utils/time';

export class GameManager {
    gameInfo: GameInfo;
    gateway: GameGateway;
    game: Game;
    startTime: number;
    currentTime: number;
    elapsedTime: number;
    deltaTime: number;
    p1Input: PlayerInput;
    p2Input: PlayerInput;
    cleanupCallback: (gameInfo: GameInfo) => void;

    constructor(gameInfo: GameInfo, gateway: GameGateway, cleanupCallback: (gameInfo: GameInfo) => void) {
        this.gameInfo = gameInfo;
        this.gateway = gateway;
        this.gameInfo.state = "IN_PROGRESS";
        this.startTime = Date.now();
        this.currentTime = this.startTime;
        this.elapsedTime = 0;
        this.deltaTime = 16;
        this.game = new Game(gameInfo.p1, gameInfo.p2, new Settings());
        this.game.on('update', this.update.bind(this));
        this.game.on('gameOver', this.gameOver.bind(this));
        this.game.on('score', this.score.bind(this));
        // this.game.on('startgame', this.startGame.bind(this));
        this.cleanupCallback = cleanupCallback;
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
        this.gateway.sendToUser(Number(this.gameInfo.roomName), "gameStatus", this.gameInfo.state);
        this.cleanup();
    }

    startGame() {
        console.log("start game" + this.gameInfo);
        this.gateway.sendToUser(Number(this.gameInfo.roomName), "gameStart", "started");
        this.game.countdown(3);
        this.gameInfo.state = "IN_PROGRESS";
    }

    userInput(body: any) {
        this.game.input.updateInput(body);
    };

    cleanup() {
        this.game.cleanup();
        this.game.removeAllListeners();
        this.cleanupCallback(this.gameInfo);
        this.game = null;
        this.gateway = null;
        this.gameInfo = null;
        this.p1Input = null;
        this.p2Input = null;
    }

    score() {
        // this.gameInfo.state = "SCORE";
        this.gateway.sendToUser(Number(this.gameInfo.roomName), "playerScored", { player: });
        this.game.score;
    }
}
