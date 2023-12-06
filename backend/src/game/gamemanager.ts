import { GameInfo } from '@prisma/client';
import { GameGateway } from './game.gateway';
import Game from './gamelogic/gamelogic';
import Settings from './gamelogic/settings';

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


    constructor(gameInfo: GameInfo, gateway: GameGateway) {
        this.gameInfo = gameInfo;
        this.gateway = gateway;
        this.gameInfo.state = "IN_PROGRESS";
        this.startTime = Date.now();
        this.currentTime = this.startTime;
        this.elapsedTime = 0;
        this.deltaTime = 16;
        this.game = new Game(gameInfo.p1, gameInfo.p2, new Settings());
        this.game.countdown();
    }

    updateClients() {
        // this.gateway.sendToUser(Number(this.gameInfo.roomName), "gamestate", "update");
        this.gateway.sendToUser(Number(this.gameInfo.roomName), "ballpos", String(this.game.ball.position.x) + "," + String(this.game.ball.position.y));
        if (this.gameInfo.state == "FINISHED") {
            this.gateway.sendToUser(Number(this.gameInfo.roomName), "gamestate", "finished");
        }
    }

    update() {
        const currentTime = Date.now();
        this.deltaTime = currentTime - this.currentTime;
        this.currentTime = currentTime;
        this.elapsedTime = this.currentTime - this.startTime;
        console.log(this.elapsedTime, this.game.ball.position);
        if (this.elapsedTime > 1000000 || this.game.p1_points > 1 || this.game.p2_points > 1) {
            this.gameInfo.state = "FINISHED";
        }
        this.game.update(this.deltaTime);
        this.updateClients();
    }

}


// export class GameManager {

// }
