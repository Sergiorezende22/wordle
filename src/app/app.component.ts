import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordsService } from './services/words.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    template: '<div class="container"><router-outlet></router-outlet></div>',
    styleUrl: './app.component.scss',
    providers: [WordsService],
})
export class AppComponent {
    title = 'wordle';
}
