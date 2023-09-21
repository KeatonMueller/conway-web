export interface GameRules {
    getNextState(grid: boolean[][], row: number, col: number): boolean;
}
