import { GameEngine } from './GameEngine.js';
import { Coordinate, GameType, Grid } from '../constants.js';

export class RectangularGameEngine extends GameEngine {
    // prettier-ignore
    private neighborCoords: number[][] = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1]
    ];
    // default to standard Conway rules
    protected neighborMin: number = 2;
    protected neighborMax: number = 3;
    protected reproductionMin: number = 3;
    protected reproductionMax: number = 3;

    public constructor(type: GameType, canvas: HTMLCanvasElement, cellSize: number) {
        super(type, canvas, cellSize);
    }

    protected getNumNeighbors(grid: Grid, row: number, col: number): number {
        let numNeighbors = 0;
        for (const neighborCoord of this.neighborCoords) {
            const nextRow = row + neighborCoord[0];
            const nextCol = col + neighborCoord[1];
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

        return [row, col];
    }
}
