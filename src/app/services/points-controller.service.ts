import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PointsController } from '../classes/points-controller';

@Injectable({
  providedIn: 'root'
})
export class PointsControllerService extends PointsController{
  private subject = new Subject<any>();

  addPoints(amount: number){
    this.points += amount;
    this.sendPoints();
  }

  sendPoints(){
    this.subject.next({points: this.points});
  }

  getPoints(){
    return this.subject.asObservable();
  }
}
