import { GameModeEnum } from '../enums/game-mode-enum';

export type GameConfig = {
    numberOfLettersPerGuess?: number;
    numberOfGuesses?: number;
    gameMode?: GameModeEnum;
};
