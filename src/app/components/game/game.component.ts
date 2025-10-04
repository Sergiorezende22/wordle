import { Component, HostListener, inject, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { GridComponent } from '../grid/grid.component';

@Component({
    selector: 'app-game',
    imports: [GridComponent],
    template: `
        @if (gameService.isGameStarted()) {
            <div class="d-flex flex-wrap justify-content-center align-items-start gap-5">
                @for (gameState of gameService.gameStates(); track $index) {
                    <app-grid [gameState]="gameState" [currentGuess]="gameService.currentGuess()"></app-grid>
                }
            </div>
        } @else {
            <p>Carregando jogo...</p>
        }
    `,
    styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
    gameService = inject(GameService);

    ngOnInit(): void {
        this.gameService.initGame();
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (this.gameService.isWin() || this.gameService.isLose()) {
            return;
        }

        const key = event.key.toLowerCase();

        if (key === 'enter') {
            this.gameService.confirmCurrentGuess();
        } else if (key === 'backspace') {
            this.gameService.backspaceCurrentGuess();
        } else if (/^[a-z]$/.test(key)) {
            this.gameService.inputCurrentGuess(key);
        }
    }
}
