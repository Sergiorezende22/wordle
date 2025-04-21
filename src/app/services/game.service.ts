import { Injectable } from '@angular/core';
import { Tile } from '../models/tile';
import { Guess } from '../models/guess';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    readonly NUMBER_OF_GUESSES = 6;
    readonly NUMBER_OF_LETTERS = 5;

    getTiles(guess: Guess, solution: string): Tile[] {
        const tiles = new Array<Tile>(solution.length)
            .fill({ value: '' })
            .map((_, index) => {
                return { value: guess.value[index] } as Tile;
            });

        if (!guess.isConfirmed) {
            return tiles;
        }

        const isMarkedArray = new Array<boolean>(solution.length).fill(false);

        for (let [i, tile] of tiles.entries()) {
            if (tile.value === solution[i]) {
                tiles[i].status = 'correct';
                isMarkedArray[i] = true;
            }
        }

        for (let [i, tile] of tiles.entries()) {
            const indexLetter = solution
                .split('')
                .findIndex(
                    (letter, index) =>
                        letter === tile.value && !isMarkedArray[index]
                );
            if (indexLetter >= 0) {
                tiles[i].status = 'present';
                isMarkedArray[indexLetter] = true;
            }

            tiles[i].status = tiles[i].status ?? 'absent';
        }

        return tiles;
    }
}
