import { computed, inject, Injectable, signal } from '@angular/core';
import { GameModeEnum } from '../enums/game-mode-enum';
import { GameConfig } from '../models/game-config';
import { GameState } from '../models/game-state';
import { IGameStrategy } from '../strategies/game-strategy';
import { NormalGameStrategy } from '../strategies/normal-game.strategy';
import { WordsService } from './words.service';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    private wordsService = inject(WordsService);

    private strategy!: IGameStrategy;

    private _gameStates = signal([] as GameState[]);
    private _currentGuess = signal('');
    private _isGameStarted = signal(false);

    public gameStates = this._gameStates.asReadonly();
    public currentGuess = this._currentGuess.asReadonly();
    public isGameStarted = this._isGameStarted.asReadonly();

    public isWin = computed(() => this.strategy?.checkWinCondition(this._gameStates()) ?? false);
    public isLose = computed(() => this.strategy?.checkLoseCondition(this._gameStates()) ?? false);
    public isGameOver = computed(() => this.isWin() || this.isLose());

    private config!: GameConfig;

    initGame(config: GameConfig = {}) {
        this.config = {
            gameMode: GameModeEnum.NORMAL,
            numberOfGuesses: 6,
            numberOfLettersPerGuess: 5,
            ...config,
        };

        this.strategy = this.getStrategy(this.config.gameMode);

        this.strategy.initializeState(this.config).subscribe((initialStates) => {
            this._gameStates.set(initialStates);
            this._currentGuess.set('');
            this._isGameStarted.set(true);
        });
    }

    confirmCurrentGuess() {
        const guess = this._currentGuess();
        const wordLength = this.config.numberOfLettersPerGuess ?? 5;

        if (this.isGameOver() || guess.length < wordLength || !this.wordsService.wordExists(guess)) {
            return;
        }

        const newStates = this.strategy.processGuess(guess, this._gameStates());
        this._gameStates.set(newStates);
        this._currentGuess.set('');
    }

    backspaceCurrentGuess() {
        this._currentGuess.update((guess) => guess.slice(0, -1));
    }

    inputCurrentGuess(letter: string) {
        if (this._currentGuess().length < (this.config.numberOfLettersPerGuess ?? 5)) {
            this._currentGuess.update((guess) => guess + letter);
        }
    }

    private getStrategy(gameMode?: GameModeEnum): IGameStrategy {
        switch (gameMode) {
            case GameModeEnum.DOUBLE_SOLUTION:
                // TODO: return new DoubleSolutionGameStrategy();
                throw new Error('Modo de jogo ainda não implementado.');
            case GameModeEnum.NORMAL:
            default:
                return new NormalGameStrategy(this.wordsService);
        }
    }
}
