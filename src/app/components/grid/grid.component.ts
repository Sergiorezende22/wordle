import { Component, input, InputSignal, signal } from '@angular/core';
import { Guess } from '../../models/guess';
import { LineComponent } from '../line/line.component';

@Component({
    selector: 'app-grid',
    imports: [LineComponent],
    templateUrl: './grid.component.html',
    styleUrl: './grid.component.scss',
})
export class GridComponent {
    guesses: InputSignal<Guess[]> = input.required();
    solution: InputSignal<string> = input.required();

    currentGuess = signal('');
}
