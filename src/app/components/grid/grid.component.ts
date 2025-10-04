import { ChangeDetectionStrategy, Component, computed, input, InputSignal } from '@angular/core';
import { GameState } from '../../models/game-state';
import { Grid } from '../../models/grid';
import { Line } from '../../models/line';
import { Tile } from '../../models/tile';
import { LineComponent } from '../line/line.component';

@Component({
    selector: 'app-grid',
    imports: [LineComponent],
    template: `
        <div class="d-flex flex-column gap-2 align-items-center justify-content-center">
            @for (line of grid().lines; track $index) {
                <app-line [line]="line"></app-line>
            }
        </div>
    `,
    styleUrl: './grid.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
    gameState: InputSignal<GameState> = input.required();
    currentGuess: InputSignal<string> = input.required();

    grid = computed<Grid>(() => {
        const state = this.gameState();
        const guess = this.currentGuess();
        const lines: Line[] = [];
        const wordLength = state.solution.length;

        for (let i = 0; i < state.numberOfGuesses; i++) {
            if (i < state.guesses.length) {
                lines.push({ tiles: this.getTilesWithStatusForGuess(state.guesses[i], state.solution) });
                continue;
            }

            if (i === state.guesses.length) {
                const currentTiles = guess
                    .padEnd(wordLength, ' ')
                    .split('')
                    .map((char) => ({ value: char.trim() }));
                lines.push({ tiles: currentTiles });
                continue;
            }

            lines.push({ tiles: Array(wordLength).fill({ value: '' }) });
        }
        return { lines };
    });

    private getTilesWithStatusForGuess(guess: string, solution: string): Tile[] {
        const solutionChars = solution.split('');
        const guessChars = guess.split('');

        const tiles: Tile[] = guessChars.map((guessChar) => ({ value: guessChar, status: 'absent' }));

        const solutionCharCount = solutionChars.reduce(
            (acc, char) => {
                acc[char] = (acc[char] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        for (let i = 0; i < solution.length; i++) {
            if (guessChars[i] === solutionChars[i]) {
                tiles[i].status = 'correct';
                solutionCharCount[guessChars[i]]--;
            }
        }

        for (let i = 0; i < solution.length; i++) {
            if (
                tiles[i].status !== 'correct' &&
                solutionChars.includes(guessChars[i]) &&
                solutionCharCount[guessChars[i]] > 0
            ) {
                tiles[i].status = 'present';
                solutionCharCount[guessChars[i]]--;
            }
        }

        return tiles;
    }
}
