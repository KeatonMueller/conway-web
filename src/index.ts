import { GameManager } from './conway/GameManager.js';
import { GameType } from './conway/constants.js';
import { GameEngine } from './conway/engine/GameEngine.js';
import { getNextGameType } from './conway/utils.js';

const CELL_SIZE = 10;
const INTERVAL_SPEED = 50;

let canvas: HTMLCanvasElement;
let gameManager: GameManager;
let gameEngine: GameEngine;

window.onload = () => {
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    gameManager = new GameManager(canvas, CELL_SIZE);
    gameEngine = gameManager.getGameEngine(GameType.RECTANGULAR);
    onWindowResize();
    gameEngine.randomize();
    interval = setInterval(() => gameEngine.iteration(), INTERVAL_SPEED);
};

// I'll switch to animation frames eventually I promise
let interval: number | null = null;

const onWindowResize = () => {
    if (!canvas) {
        return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameEngine.resetGame();
};

window.addEventListener('resize', onWindowResize);

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case ' ':
            if (interval != null) {
                clearInterval(interval);
                interval = null;
            } else {
                interval = setInterval(() => gameEngine.iteration(), INTERVAL_SPEED);
            }
            break;
        case 'Enter':
            gameEngine.randomize();
            break;
        case '.':
            gameEngine = gameManager.getGameEngine(getNextGameType(gameEngine.type));
            gameEngine.randomize();
            break;
        default:
            return;
    }
});
