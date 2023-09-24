import { Coordinate, GameType, Grid } from '../constants.js';

/**
 * Abstract class for running Conway's Game of Life using multiple rule sets
 * and grid patterns.
 */
export abstract class GameEngine {
    /**
     * Array of two grids.
     *
     * At any given time, either grid could represent the current state of the game.
     * Each grid alternates being used to store the next state of the game based on the other grid.
     */
    private grids!: Grid[];
    /**
     * Indicates which grid stores the current game state.
     */
    private gridIdx!: number;
    /**
     * Width of game grid.
     */
    private gridWidth!: number;
    /**
     * Height of game grid.
     */
    private gridHeight!: number;
    /**
     * HTML Canvas element that the game state will be painted on.
     */
    private canvas: HTMLCanvasElement;
    /**
     * Event listener added to canvas to handle click events.
     */
    private clickEventListener: (event: PointerEvent) => void;
    /**
     * Canvas 2D rendering context used to paint the game state.
     */
    protected ctx: CanvasRenderingContext2D;
    /**
     * Size (in pixels) of a single cell in the grid.
     */
    protected cellSize: number;
    /**
     * Type of game currently running.
     */
    public type: GameType;

    /**
     * ======================
     * == Abstract Members ==
     * ======================
     */

    /**
     * Minimum number of neighbors for a cell to remain alive
     */
    protected abstract neighborMin: number;
    /**
     * Maximum number of neighbors for a cell to remain alive
     */
    protected abstract neighborMax: number;
    /**
     * Minimum number of neighbors for a cell to become alive
     */
    protected abstract reproductionMin: number;
    /**
     * Maximum number of neighbors for a cell to become alive
     */
    protected abstract reproductionMax: number;
    /**
     * Fetch the number of alive neighbors at the given location on the given grid.
     * @param grid Given grid
     * @param row Given row
     * @param col Given column
     */
    protected abstract getNumNeighbors(grid: Grid, row: number, col: number): number;
    /**
     * Paint the given value at the given location on the canvas.
     * @param row Given row
     * @param col Given column
     * @param value Value of cell
     */
    protected abstract paintCell(row: number, col: number, value: boolean): void;
    /**
     * Find the (row, col) coordinate corresponding to the given click event.
     * @param x Given x location of click event on the canvas
     * @param y Given y location of click event on the canvas
     */
    protected abstract getCoordinate(x: number, y: number): Coordinate;

    public constructor(type: GameType, canvas: HTMLCanvasElement, pixelSize: number) {
        this.type = type;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.cellSize = pixelSize;
        this.resetGame();

        const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
        const canvasTop = canvas.offsetTop + canvas.clientTop;

        this.clickEventListener = (event: PointerEvent) => {
            const x = event.x - canvasLeft;
            const y = event.y - canvasTop;

            const [row, col] = this.getCoordinate(x, y);

            this.toggle(row, col);
        };

        canvas.addEventListener('pointerdown', this.clickEventListener);
    }

    public destroy() {
        this.canvas.removeEventListener('pointerdown', this.clickEventListener);
    }

    public resetGame() {
        this.gridWidth = Math.floor(this.canvas.width / this.cellSize);
        this.gridHeight = Math.floor(this.canvas.height / this.cellSize);

        this.gridIdx = 0;
        this.grids = [
            new Array(this.gridHeight).fill(0).map(() => new Array(this.gridWidth).fill(false)),
            new Array(this.gridHeight).fill(0).map(() => new Array(this.gridWidth).fill(false)),
        ];
    }

    public toggle(row: number, col: number) {
        if (row < 0 || row > this.gridHeight || col < 0 || col > this.gridWidth) {
            return;
        }
        const newValue = !this.grids[this.gridIdx][row][col];
        this.grids[this.gridIdx][row][col] = newValue;
        this.paintCell(row, col, newValue);
    }

    private getNextState(grid: Grid, row: number, col: number): boolean {
        const numNeighbors = this.getNumNeighbors(grid, row, col);

        if (grid[row][col]) {
            return this.neighborMin <= numNeighbors && numNeighbors <= this.neighborMax;
        }
        return this.reproductionMin <= numNeighbors && numNeighbors <= this.reproductionMax;
    }

    public iteration() {
        const currentGrid: Grid = this.grids[this.gridIdx];
        const nextGrid: Grid = this.grids[1 - this.gridIdx];
        for (let row = 0; row < this.gridHeight; row++) {
            for (let col = 0; col < this.gridWidth; col++) {
                nextGrid[row][col] = this.getNextState(currentGrid, row, col);

                if (nextGrid[row][col] != currentGrid[row][col]) {
                    this.paintCell(row, col, nextGrid[row][col]);
                }
            }
        }
        this.gridIdx = 1 - this.gridIdx;
    }
}
