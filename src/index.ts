import { GameEngine } from './conway/GameEngine.js';

const PIXEL_SIZE = 100;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let game: GameEngine;

window.onload = () => {
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    initGame();
};

let interval: number;

const initGame = () => {
    clearInterval(interval);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    game = new GameEngine(canvas, PIXEL_SIZE);
    game.setValue(0, 1, true);
    game.setValue(1, 1, true);
    game.setValue(2, 1, true);

    interval = setInterval(() => game.iteration(), 200);
};

window.addEventListener('resize', initGame);
