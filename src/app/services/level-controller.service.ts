import { Injectable } from '@angular/core';
import { LEVELS } from '../levels/levels';
import { Observable } from 'rxjs';
import { Level } from '../interfaces/level';

@Injectable({
  providedIn: 'root'
})
export class LevelControllerService {

  constructor() { }

  getLevel(level: number = 0) {
    return LEVELS[level]
  }
}
