import { GameRules } from './rules/GameRules.js';
import { RectangularGameRules } from './rules/RectangularGameRules.js';

// represent game state as a 2d array of booleans
type Grid = boolean[][];

export class GameEngine {
    // store two grids; taking turns using one to calculate the state of the other
    #grids!: Grid[];
    // indicates which of the grids is active on screen
    #gridIdx!: number;
    // game engine needs direct access to the canvas so it can render the squares as it calculates their state
    #canvas: HTMLCanvasElement;
    #ctx: CanvasRenderingContext2D;
    #pixelSize: number;
    #gameRules: GameRules;
    gridWidth!: number;
    gridHeight!: number;

    constructor(canvas: HTMLCanvasElement, pixelSize: number, gameRules?: GameRules) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.#pixelSize = pixelSize;
        this.#gameRules = gameRules || new RectangularGameRules();
        this.resetGame();
    }

    resetGame() {
        this.gridWidth = Math.floor(this.#canvas.width / this.#pixelSize);
        this.gridHeight = Math.floor(this.#canvas.height / this.#pixelSize);

        this.#gridIdx = 0;
        this.#grids = [
            new Array(this.gridHeight).fill(0).map(() => new Array(this.gridWidth).fill(false)),
            new Array(this.gridHeight).fill(0).map(() => new Array(this.gridWidth).fill(false)),
        ];
    }

    toggle(row: number, col: number) {
        if (row < 0 || row > this.gridHeight || col < 0 || col > this.gridWidth) {
            return;
        }
        const newValue = !this.#grids[this.#gridIdx][row][col];
        this.#grids[this.#gridIdx][row][col] = newValue;
        this.#ctx.fillStyle = newValue ? 'white' : 'black';
        this.#ctx.fillRect(col * this.#pixelSize, row * this.#pixelSize, this.#pixelSize, this.#pixelSize);
    }

    iteration() {
        const currentGrid: Grid = this.#grids[this.#gridIdx];
        const nextGrid: Grid = this.#grids[1 - this.#gridIdx];
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                nextGrid[row][col] = this.#gameRules.getNextState(currentGrid, row, col);

                if (nextGrid[row][col] != currentGrid[row][col]) {
                    this.#ctx.fillStyle = nextGrid[row][col] ? 'white' : 'black';
                    this.#ctx.fillRect(col * this.#pixelSize, row * this.#pixelSize, this.#pixelSize, this.#pixelSize);
                }
            }
        }
        this.#gridIdx = 1 - this.#gridIdx;
    }
}
