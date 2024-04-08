import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  public shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return [...array];
  }

  public parseDate(date: string): Date | undefined {
    const parts = date.match(/(\d+)/g);
    if (!parts) {
      return undefined;
    }
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  }
}
