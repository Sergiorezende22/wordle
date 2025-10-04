import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    OnInit,
    signal,
} from '@angular/core';
import { GridComponent } from '../../components/grid/grid.component';
import { Guess } from '../../models/guess';
import { WordsService } from '../../services/words.service';

@Component({
    selector: 'app-wordle-page',
    imports: [GridComponent],
    templateUrl: './wordle-page.component.html',
    styleUrl: './wordle-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordlePageComponent implements OnInit {
    readonly NUMBER_OF_GUESSES = 6;
    readonly NUMBER_OF_LETTERS = 5;

    currentGuessIndex = 0;
    gameOver = false;

    solution = signal('');
    guesses = signal(
        new Array<Guess>(this.NUMBER_OF_GUESSES).fill({
            value: '',
            isConfirmed: false,
        })
    );

    constructor(private readonly wordsService: WordsService) {}

    ngOnInit(): void {
        this.wordsService
            .getWords(1, this.NUMBER_OF_LETTERS)
            .subscribe((words) => {
                this.solution.set(words[0]);
            });
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (this.gameOver) {
            return;
        }

        const key = event.key.toLowerCase();
        const currentGuess = this.guesses()[this.currentGuessIndex].value;

        if (key === 'enter') {
            if (currentGuess.length < this.NUMBER_OF_LETTERS) {
                return;
            }

            if (
                this.guesses().some(
                    (guess) => guess.value === currentGuess && guess.isConfirmed
                )
            ) {
                return;
            }

            if (!this.wordsService.wordExists(currentGuess)) {
                return;
            }

            this.updateGuess(this.currentGuessIndex, {
                value: currentGuess,
                isConfirmed: true,
            });
            this.currentGuessIndex++;

            if (
                this.currentGuessIndex >= this.NUMBER_OF_GUESSES ||
                currentGuess === this.solution()
            ) {
                this.gameOver = true;
                return;
            }
        } else if (key === 'backspace') {
            if (currentGuess.length > 0) {
                this.updateGuess(this.currentGuessIndex, {
                    value: currentGuess.slice(0, -1),
                    isConfirmed: false,
                });
            }
        } else if (/^[a-z]$/.test(key)) {
            if (currentGuess.length < this.NUMBER_OF_LETTERS) {
                this.updateGuess(this.currentGuessIndex, {
                    value: currentGuess + key,
                    isConfirmed: false,
                });
            }
        }
    }

    updateGuess(index: number, value: Guess) {
        this.guesses.update((prev) => {
            const newGuesses = [...prev];
            newGuesses[index] = value;
            return newGuesses;
        });
    }
}
