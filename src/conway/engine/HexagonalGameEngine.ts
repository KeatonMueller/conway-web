import { GameEngine } from './GameEngine.js';
import { Coordinate, GameType, Grid } from '../constants.js';

/**
 * Game engine for running Conway's Game of Life on a hexagonal grid.
 *
 * A grid is still defined as a 2D array of booleans.
 *
 * This is how a 4x3 grid would be laid out:
 *
 *       / \     / \     / \
 *     /     \ /     \ /     \
 *    |  0,0  |  0,1  |  0,2  |
 *    |       |       |       |
 *     \     / \     / \     / \
 *       \ /     \ /     \ /     \
 *        |  1,0  |  1,1  |  1,2  |
 *        |       |       |       |
 *       / \     / \     / \     /
 *     /     \ /     \ /     \ /
 *    |  2,0  |  2,1  |  2,2  |
 *    |       |       |       |
 *     \     / \     / \     / \
 *       \ /     \ /     \ /     \
 *        |  3,0  |  3,1  |  3,2  |
 *        |       |       |       |
 *         \     / \     / \     /
 *           \ /     \ /     \ /
 */
export class HexagonalGameEngine extends GameEngine {
    // prettier-ignore
    private evenRowNeighborCoords: Coordinate[] = [
            { row: -1, col: -1 }, { row: -1, col: 0 },
        { row: 0, col: -1 },            { row: 0, col: 1 },
            { row: 1, col: -1 }, { row: 1, col: 0 },
    ];
    // prettier-ignore
    private oddRowNeighborCoords: Coordinate[] = [
            { row: -1, col: 0 }, { row: -1, col: 1 },
        { row: 0, col: -1 },            { row: 0, col: 1 },
            { row: 1, col: 0 }, { row: 1, col: 1 },
    ];
    private sideLength!: number;
    private innerHeight!: number;

    protected gridWidth!: number;
    protected gridHeight!: number;

    protected neighborMin: number = 1;
    protected neighborMax: number = 3;
    protected reproductionMin: number = 3;
    protected reproductionMax: number = 4;

    public constructor(canvas: HTMLCanvasElement, cellSize: number) {
        super(GameType.HEXAGONAL, canvas, cellSize);
    }

    protected calculateGridDimensions(): void {
        this.sideLength = Math.floor(this.cellSize / Math.sqrt(3));
        this.innerHeight = Math.floor((this.cellSize * Math.sqrt(3)) / 6);

        this.gridWidth = Math.floor(this.canvas.width / this.cellSize);
        this.gridHeight = Math.floor(this.canvas.height / (this.sideLength + this.innerHeight)) - 1;
    }

    protected getNumNeighbors(grid: Grid, row: number, col: number): number {
        let numNeighbors = 0;
        const neighborCoords = row % 2 === 0 ? this.evenRowNeighborCoords : this.oddRowNeighborCoords;
        for (const neighborCoord of neighborCoords) {
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
        // calculate top left coordinates of hexagon
        const x = col * this.cellSize + ((row % 2) * this.cellSize) / 2;
        const y = row * (this.innerHeight + this.sideLength);

        this.ctx.fillStyle = value ? 'white' : 'black';
        const offset = value ? 1 : 0; // draw white hexagons 1 pixel smaller to account for anti-aliasing

        this.ctx.beginPath();
        this.ctx.moveTo(x + this.cellSize / 2, y + offset);
        this.ctx.lineTo(x + this.cellSize - offset, y + this.innerHeight + offset);
        this.ctx.lineTo(x + this.cellSize - offset, y + this.innerHeight + this.sideLength - offset);
        this.ctx.lineTo(x + this.cellSize / 2, y + 2 * this.innerHeight + this.sideLength - offset);
        this.ctx.lineTo(x + offset, y + this.innerHeight + this.sideLength - offset);
        this.ctx.lineTo(x + offset, y + this.innerHeight + offset);
        this.ctx.fill();
    }

    private getDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    protected getCoordinate(x: number, y: number): Coordinate {
        const row = Math.floor(y / (this.innerHeight + this.sideLength));
        const col = Math.floor((x - ((row % 2) * this.cellSize) / 2) / this.cellSize);

        // there's a chance the calculated row & col aren't correct because of the diagonals
        // on hexagons; calculate distance to center of adjacent cells to be sure
        const neighborCoords = row % 2 === 0 ? this.evenRowNeighborCoords : this.oddRowNeighborCoords;

        let shortestDistance: number = Infinity;
        let closestNeighbor: Coordinate = { row, col };
        for (const neighborCoord of [...neighborCoords, { row: 0, col: 0 }]) {
            const neighborRow = row + neighborCoord.row;
            const neighborCol = col + neighborCoord.col;

            if (neighborRow < 0 || neighborRow > this.gridHeight || neighborCol < 0 || neighborCol > this.gridWidth) {
                continue;
            }

            const neighborX = neighborCol * this.cellSize + ((neighborRow % 2) * this.cellSize) / 2;
            const neighborY = neighborRow * (this.innerHeight + this.sideLength);
            const centerX = neighborX + this.cellSize / 2;
            const centerY = neighborY + this.innerHeight + this.sideLength / 2;

            const neighborDistance = this.getDistance(x, y, centerX, centerY);
            if (neighborDistance < shortestDistance) {
                shortestDistance = neighborDistance;
                closestNeighbor = { row: neighborRow, col: neighborCol };
            }
        }

        return closestNeighbor;
    }
}
