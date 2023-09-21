import { GameRules } from './rules/GameRules.js';
import { RectangularGameRules } from './rules/RectangularGameRules.js';

export class GameEngine {
    primaryGrid!: boolean[][];
    secondaryGrid!: boolean[][];
    width: number;
    height: number;
    gameRules: GameRules;

    constructor(width: number, height: number, gameRules?: GameRules) {
        this.width = width;
        this.height = height;
        this.gameRules = gameRules || new RectangularGameRules();
        this.resetGame();
    }

    resetGame() {
        this.primaryGrid = new Array(this.height).fill(0).map(() => new Array(this.width).fill(false));
        this.secondaryGrid = new Array(this.height).fill(0).map(() => new Array(this.width).fill(false));
    }

    iteration() {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                this.secondaryGrid[row][col] = this.gameRules.getNextState(this.primaryGrid, row, col);
            }
        }
        // deep copy secondary grid to primary grid
        this.primaryGrid = this.secondaryGrid.map((row) => row.slice());
    }

    show() {
        for (let row = 0; row < this.width; row++) {
            let line = row + '   ';
            for (let col = 0; col < this.height; col++) {
                if (this.primaryGrid[row][col]) {
                    line += '■';
                } else {
                    line += '□';
                }
            }
            console.log(line);
        }
    }
}
