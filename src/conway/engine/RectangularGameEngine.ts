import { GameEngine } from './GameEngine.js';
import { Coordinate, GameType, Grid } from '../constants.js';

export class RectangularGameEngine extends GameEngine {
    //prettier-ignore
    private neighborCoords: Coordinate[] = [
        { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
        { row:  0, col: -1 },                      { row:  0, col: 1 },
        { row:  1, col: -1 }, { row:  1, col: 0 }, { row:  1, col: 1 },
    ];

    protected gridWidth!: number;
    protected gridHeight!: number;

    // default to standard Conway rules
    protected neighborMin: number = 2;
    protected neighborMax: number = 3;
    protected reproductionMin: number = 3;
    protected reproductionMax: number = 3;

    public constructor(canvas: HTMLCanvasElement, cellSize: number) {
        super(GameType.RECTANGULAR, canvas, cellSize);
    }

    protected calculateGridDimensions(): void {
        this.gridWidth = Math.floor(this.canvas.width / this.cellSize);
        this.gridHeight = Math.floor(this.canvas.height / this.cellSize);
    }

    protected getNumNeighbors(grid: Grid, row: number, col: number): number {
        let numNeighbors = 0;
        for (const neighborCoord of this.neighborCoords) {
            const nextRow = row + neighborCoord.row;
            const nextCol = col + neighborCoord.col;
            // taking advantage of the fact that indexing out of bounds in JS just returns undefined
            if (grid[nextRow] && grid[nextRow][nextCol]) {
                numNeighbors++;
            }
        }
        return numNeighbors;
    }

    protected paintCell(row: number, col: number, value: boolean): void {
        this.ctx.fillStyle = value ? 'white' : 'black';
        this.ctx.fillRect(col * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
    }

    protected getCoordinate(x: number, y: number): Coordinate {
        const row = Math.floor(y / this.cellSize);
        const col = Math.floor(x / this.cellSize);

        return { row, col };
    }
}
