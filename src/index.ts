import { GameManager } from './conway/GameManager.js';
import { GameEngine } from './conway/engine/GameEngine.js';

const PIXEL_SIZE = 100;

let canvas: HTMLCanvasElement;
let gameManager: GameManager;
let gameEngine: GameEngine;

window.onload = () => {
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    gameManager = new GameManager(canvas, PIXEL_SIZE);
    gameEngine = gameManager.getGameEngine();
    initGame();
};

// I'll switch to animation frames eventually I promise
let interval: number | null = null;

const initGame = () => {
    if (interval != null) {
        clearInterval(interval);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameEngine.resetGame();

    gameEngine.toggle(0, 1);
    gameEngine.toggle(1, 1);
    gameEngine.toggle(2, 1);

    interval = setInterval(() => gameEngine.iteration(), 200);
};

window.addEventListener('resize', initGame);

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case ' ':
            if (interval != null) {
                clearInterval(interval);
                interval = null;
            } else {
                interval = setInterval(() => gameEngine.iteration(), 200);
            }
            break;
        default:
            return;
    }
});
