import { Observable } from 'rxjs';
import { GameConfig } from '../models/game-config';
import { GameState } from '../models/game-state';

export interface IGameStrategy {
    initializeState(config: GameConfig): Observable<GameState[]>;

    processGuess(currentGuess: string, currentState: GameState[]): GameState[];

    checkWinCondition(currentState: GameState[]): boolean;

    checkLoseCondition(currentState: GameState[]): boolean;
}
