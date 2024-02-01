import { GameInfo } from '@prisma/client';
// import { GameGateway } from './game.gateway';
import Game from './gamelogic/gamelogic';
import Settings from './gamelogic/settings';
import { PlayerInput } from './gamelogic/input';
import { gameStateDto } from './dto';
import { from } from 'rxjs';
import { log } from 'console';
import { Socket } from 'socket.io';
import { GatewayService } from 'src/gateway/gateway.service';
import { GatewayGateway } from 'src/gateway/gateway.gateway';

export class GameManager {
    gameInfo: GameInfo;
    gatewayService: GatewayService;
    gateway: GatewayGateway;
    game: Game;
    p1Input: PlayerInput;
    p2Input: PlayerInput;
    p1Socket: Socket;
    p2Socket: Socket;
    cleanupCallback: (gameInfo: GameInfo) => void;
    startCallback: (gameInfo: GameInfo) => void;

    constructor(gameInfo: GameInfo, gatewayService: GatewayService, gateway: GatewayGateway, cleanupCallback: (gameInfo: GameInfo) => void, startCallback: (gameInfo: GameInfo) => void) {
        this.gameInfo = gameInfo;
        this.gatewayService = gatewayService;
        this.gateway = gateway;
        this.p1Socket = gatewayService.get_socket_from_user(gameInfo.p1);
        this.p2Socket = gatewayService.get_socket_from_user(gameInfo.p2);
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

    sendToRoom(event: string, data: any) {
        this.gateway.server.to(String(this.gameInfo.roomName)).emit(event, data);
    }

    updateClients() {
        // this.p1Socket.emit('gameUpdate', this.game.state);
        // this.p2Socket.emit('gameUpdate', this.game.state);
        this.sendToRoom('gameUpdate', this.game.state);
    }

    update() {
        this.updateClients();
    }

    gameOver() {
        this.gameInfo.state = "FINISHED";
        console.log("game over");
        this.gameInfo.score = this.game.getScore();
        this.gameInfo.winner = this.game.getWinner();
        this.gameInfo.loser = this.game.getLoser();
        this.sendToRoom("gameStatus", this.gameInfo.state);
        this.cleanup();
    }

    startGame() {
        console.log("start game" + this.gameInfo);
        this.sendToRoom("gameStart", "started");
        this.game.countdown(3);
        this.gameInfo.state = "IN_PROGRESS";
        this.startCallback(this.gameInfo);
    }

    userInput(body: any) {
        if (this.game)
            this.game.input.updateInput(body);
    };

    removeSocketListeners() {
        this.p1Socket.removeAllListeners('userInput');
        this.p2Socket.removeAllListeners('userInput');
    }

    cleanup() {
        this.game.cleanup();
        this.game.removeAllListeners();
        this.removeSocketListeners();
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
        this.sendToRoom("playerScored", {
            player: this.game.lastScored,
            p1_points: this.game.p1_points,
            p2_points: this.game.p2_points
        });
        // this.game.score;
    }

    countdown() {
        this.sendToRoom("countdown", { count: 3 });
    }
}
