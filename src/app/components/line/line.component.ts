import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { Line } from '../../models/line';
import { TileComponent } from '../tile/tile.component';

@Component({
    selector: 'app-line',
    imports: [TileComponent],
    template: `
        <div class="d-flex gap-2">
            @for (tile of line().tiles; track $index; let idx = $index) {
                <app-tile [tile]="tile" [idx]="idx"></app-tile>
            }
        </div>
    `,
    styleUrl: './line.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineComponent {
    line: InputSignal<Line> = input.required();
}
