import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { Tile } from '../../models/tile';

@Component({
    selector: 'app-tile',
    imports: [CommonModule],
    template: `
        @let value = tile().value;
        @let status = tile().status;

        <div
            class="tile d-flex justify-content-center align-items-center p-2 text-uppercase fw-bold"
            [ngClass]="[status ?? '', !!value && !status ? 'with-letter' : '']"
            [ngStyle]="{ '--index': idx() }"
        >
            {{ value }}
        </div>
    `,
    styleUrl: './tile.component.scss',
})
export class TileComponent {
    tile: InputSignal<Tile> = input.required();
    idx: InputSignal<number> = input.required();
}
