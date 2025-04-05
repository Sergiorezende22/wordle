import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import englishWords from 'an-array-of-english-words';

@Injectable({
  providedIn: 'root'
})
export class WordsService {
  private wordSet: Set<string>;

  constructor(private httpClient: HttpClient) { 
    this.wordSet = new Set(englishWords.map(word => word.toLowerCase()));
  }

  getWords(numberOfWords: number, wordLength: number) {
    let params = new HttpParams();
    params = params.append('number', numberOfWords.toString());
    params = params.append('length', wordLength.toString());

    return this.httpClient.get<string[]>('https://random-word-api.vercel.app/api', { params });
  }

  wordExists(word: string): boolean {
    return this.wordSet.has(word.toLowerCase());
  }
}