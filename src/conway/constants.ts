export enum GameType {
    RECTANGULAR,
    HEXAGONAL,
}

// represent game state as a 2d array of booleans
export type Grid = boolean[][];

export type Coordinate = {
    row: number;
    col: number;
};
