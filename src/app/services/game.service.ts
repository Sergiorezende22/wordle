import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  readonly NUMBER_OF_GUESSES = 6;
  readonly NUMBER_OF_LETTERS = 5;

  constructor() { }
  
}
