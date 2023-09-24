export enum GameType {
    RECTANGULAR,
    HEXAGONAL,
}

// represent game state as a 2d array of booleans
export type Grid = boolean[][];

// tuple representing a (row, col) coordinate
export type Coordinate = [number, number];
