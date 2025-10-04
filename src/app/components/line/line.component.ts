import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    InputSignal,
} from '@angular/core';
import { Guess } from '../../models/guess';
import { GameService } from '../../services/game.service';

@Component({
    selector: 'app-line',
    imports: [CommonModule],
    templateUrl: './line.component.html',
    styleUrl: './line.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineComponent {
    guess: InputSignal<Guess> = input.required();
    solution: InputSignal<string> = input.required();

    constructor(private readonly gameService: GameService) {}

    tiles = computed(() => {
        const guess = this.guess();
        const solution = this.solution();

        return this.gameService.getTiles(guess, solution);
    });
}
