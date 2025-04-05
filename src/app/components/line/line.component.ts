import { CommonModule } from '@angular/common';
import { Component, computed, input, InputSignal } from '@angular/core';
import { Guess } from '../../models/guess';
import { Tile } from '../../models/tile';

@Component({
    selector: 'app-line',
    imports: [CommonModule],
    templateUrl: './line.component.html',
    styleUrl: './line.component.scss',
})
export class LineComponent {
    guess: InputSignal<Guess> = input.required();
    solution: InputSignal<string> = input.required();
    numberOfLetters: InputSignal<number> = input.required();

    tiles = computed(() => {
        const tiles = new Array<Tile>(this.numberOfLetters());
        const guess = this.guess();
        const solution = this.solution();

        const isMarkedArray = new Array<boolean>(this.numberOfLetters()).fill(
            false
        );

        for (let i = 0; i < this.numberOfLetters(); i++) {
            tiles[i] = { value: guess.value[i] || '' };

            if (guess.isConfirmed) {
                if (guess.value[i] === solution[i]) {
                    tiles[i].status = 'correct';
                    isMarkedArray[i] = true;
                    continue;
                }

                if (!solution.includes(guess.value[i])) {
                    tiles[i].status = 'absent';
                    continue;
                }

                const indexLetter = solution
                    .split('')
                    .findIndex(
                        (letter, index) =>
                            letter === guess.value[i] && !isMarkedArray[index]
                    );
                if (indexLetter >= 0) {
                    tiles[i].status = 'present';
                    isMarkedArray[indexLetter] = true;
                    continue;
                }

                tiles[i].status = 'absent';
            }
        }

        return tiles;
    });
}
