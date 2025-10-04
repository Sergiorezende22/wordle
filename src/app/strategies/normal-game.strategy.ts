import { map, Observable } from 'rxjs';
import { GameConfig } from '../models/game-config';
import { GameState } from '../models/game-state';
import { WordsService } from '../services/words.service';
import { IGameStrategy } from './game-strategy';

/**
 * Lógica do modo de jogo normal. Não se preocupa mais em construir a UI (grid).
 */
export class NormalGameStrategy implements IGameStrategy {
    constructor(private wordsService: WordsService) {}

    private readonly DEFAULT_GUESSES = 6;
    private readonly DEFAULT_LETTERS = 5;

    private numberOfGuesses!: number;
    private numberOfLetters!: number;

    initializeState(config: GameConfig): Observable<GameState[]> {
        this.numberOfGuesses = config.numberOfGuesses ?? this.DEFAULT_GUESSES;
        this.numberOfLetters = config.numberOfLettersPerGuess ?? this.DEFAULT_LETTERS;

        return this.wordsService.getWords(1, this.numberOfLetters).pipe(
            map((words) => {
                const solution = words[0];
                const initialState: GameState = {
                    solution: solution,
                    guesses: [],
                    isWin: false,
                    isLose: false,
                    numberOfGuesses: this.numberOfGuesses,
                    isActive: true,
                };
                return [initialState];
            }),
        );
    }

    processGuess(guess: string, currentState: GameState[]): GameState[] {
        const activeGameState = currentState[0];
        const newGuesses = [...activeGameState.guesses, guess];
        const isWin = guess === activeGameState.solution;
        const isLose = !isWin && newGuesses.length >= this.numberOfGuesses;

        const newState: GameState = {
            ...activeGameState,
            guesses: newGuesses,
            isWin,
            isLose,
        };

        return [newState];
    }

    checkWinCondition(currentState: GameState[]): boolean {
        return currentState.some((state) => state.isWin);
    }

    checkLoseCondition(currentState: GameState[]): boolean {
        return currentState.every((state) => state.isLose);
    }
}
