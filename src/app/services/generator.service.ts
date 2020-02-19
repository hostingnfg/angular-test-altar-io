import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {Clock} from '../models/clock';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {
  get gridState(): BehaviorSubject<Map<number, Map<number, string>>> {
    return this._gridState;
  }

  set char(value: string) {
    this._char = value;
  }

  get code(): Subject<string> {
    return this._code;
  }

  get clock(): Subject<Clock> {
    return this._clock;
  }

  set clock(value: Subject<Clock>) {
    this._clock = value;
  }

  private readonly _gridState: BehaviorSubject<Map<number, Map<number, string>>>;
  private _clock = new Subject<Clock>();
  private _code = new Subject<string>();
  private _char = '';
  private readonly _chars = 'abcdefghijklmnopqrstuvwxyz';

  constructor() {
     const next = new Map<number, Map<number, string>>();
     for (let i = 0; i < 10; i++) {
       const line = new Map<number, string>();
       for (let j = 0; j < 10; j++) {
         line.set(j, 'a');
       }
       next.set(i, line);
     }
    this._gridState = new BehaviorSubject<Map<number, Map<number, string>>>(next);
    setInterval(() => {
       const now = new Date();
       const hours = now.getHours();
       const minutes = now.getMinutes();
       const seconds = now.getSeconds();
       const clock = {
         hours: hours < 10 ? `0${hours}` : hours.toString(),
         minutes: minutes < 10 ? `0${minutes}` : minutes.toString(),
         seconds: seconds < 10 ? `0${seconds}` : seconds.toString(),
       } as Clock;
       this.clock.next(clock);
       this.updateCode(clock);
    }, 1000);
    setInterval(() => {
      this.generate(this.char);
    }, 2000);
  }

  public generate(char: string) {
    const next = new Map<number, Map<number, string>>();
    for (let i = 0; i < 10; i++) {
      const line = new Map<number, string>();
      for (let j = 0; j < 10; j++) {
        line.set(j, this._chars.charAt(Math.floor(Math.random() * this._chars.length)));
      }
      next.set(i, line);
    }
    if (char) {
      let indexes = [];
      for (;indexes.length < 20;) {
        indexes.push(Math.round(- 0.5 + Math.random() * 100));
        indexes = [...new Set(indexes)]
      }
      indexes.forEach(e => {
          next.get(e%10).set(Math.floor(e/10), char);
      });
      this.char = char;
    }
    this.gridState.next(next);
  }

  private updateCode(clock: Clock) {
    const a = Number.parseInt(clock.seconds.substring(0, 1),  0);
    const b = Number.parseInt(clock.seconds.substring(1), 0);
    const aSymbol = this.gridState.getValue().get(a).get(b);
    const bSymbol = this.gridState.getValue().get(b).get(a);
    let aOccurrences = this.getOccurrences(aSymbol);
    let bOccurrences = this.getOccurrences(bSymbol);
    if (aOccurrences > 9) {
      aOccurrences = this.getNewOccurrences(aOccurrences);
    }
    if (bOccurrences > 9) {
      bOccurrences = this.getNewOccurrences(bOccurrences);
    }
    this.code.next(`${aOccurrences}${bOccurrences}`);
  }

  private getNewOccurrences(occurrences: number) {
    const divider = Math.ceil(occurrences / 9);
    return Math.round(occurrences / divider);
  }

  private getOccurrences(symbol: string) {
    return [...this.gridState.getValue().entries()].reduce((acc, [key, val]) => {
      return acc + [...val.entries()].filter(([k, v]) => v === symbol).length;
    }, 0);
  }
}
