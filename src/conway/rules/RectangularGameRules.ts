import { GameRules } from './GameRules.js';

export class RectangularGameRules implements GameRules {
    neighborMin: number = 2;
    neighborMax: number = 3;
    reproductionMin: number = 3;
    reproductionMax: number = 3;
    // prettier-ignore
    neighborCoords: number[][] = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1]
    ];

    getNeighbors(grid: boolean[][], row: number, col: number): number {
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

    getNextState(grid: boolean[][], row: number, col: number): boolean {
        const numNeighbors = this.getNeighbors(grid, row, col);

        if (grid[row][col]) {
            return this.neighborMin <= numNeighbors && numNeighbors <= this.neighborMax;
        }
        return this.reproductionMin <= numNeighbors && numNeighbors <= this.reproductionMax;
    }
}
