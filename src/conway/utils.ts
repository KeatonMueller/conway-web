import { GameType } from './constants.js';

const GAME_TYPES: GameType[] = Object.keys(GameType)
    .filter((x) => isNaN(Number(x)))
    .map((x) => GameType[x as keyof typeof GameType]);

export const getNextGameType = (currentGameType: GameType): GameType => {
    const currentIdx = GAME_TYPES.indexOf(currentGameType);
    return GAME_TYPES[(currentIdx + 1) % GAME_TYPES.length];
};
