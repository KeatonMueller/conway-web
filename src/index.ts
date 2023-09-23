import { GameEngine } from './conway/GameEngine.js';

const PIXEL_SIZE = 100;

let canvas: HTMLCanvasElement;
let game: GameEngine;

window.onload = () => {
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    game = new GameEngine(canvas, PIXEL_SIZE);
    initGame();

    const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
    const canvasTop = canvas.offsetTop + canvas.clientTop;

    canvas.addEventListener('pointerdown', (event) => {
        const x = event.x - canvasLeft;
        const y = event.y - canvasTop;

        const row = Math.floor(y / PIXEL_SIZE);
        const col = Math.floor(x / PIXEL_SIZE);

        game.toggle(row, col);
    });
};

// I'll switch to animation frames eventually I promise
let interval: number | null = null;

const initGame = () => {
    if (interval != null) {
        clearInterval(interval);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game.resetGame();

    game.toggle(0, 1);
    game.toggle(1, 1);
    game.toggle(2, 1);

    interval = setInterval(() => game.iteration(), 200);
};

window.addEventListener('resize', initGame);

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case ' ':
            if (interval != null) {
                clearInterval(interval);
                interval = null;
            } else {
                interval = setInterval(() => game.iteration(), 200);
            }
            break;
        default:
            return;
    }
});
