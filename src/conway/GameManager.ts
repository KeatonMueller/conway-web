import { GameType } from './constants.js';
import { GameEngine } from './engine/GameEngine.js';
import { RectangularGameEngine } from './engine/RectangularGameEngine.js';

/**
 * Manages swapping between game engines.
 *
 * Will be more exciting once more game types are added.
 */
export class GameManager {
    private canvas: HTMLCanvasElement;
    private cellSize: number;
    private gameEngine: GameEngine | null;

    public constructor(canvas: HTMLCanvasElement, cellSize: number) {
        this.canvas = canvas;
        this.cellSize = cellSize;
        this.gameEngine = null;
    }

    public getGameEngine(gameType?: GameType): GameEngine {
        const nextGameType = gameType ?? GameType.RECTANGULAR;

        if (this.gameEngine && this.gameEngine.type === nextGameType) {
            return this.gameEngine;
        }

        this.gameEngine?.destroy();

        switch (nextGameType) {
            case GameType.RECTANGULAR:
            default:
                this.gameEngine = new RectangularGameEngine(nextGameType, this.canvas, this.cellSize);
        }

        return this.gameEngine!;
    }
}
