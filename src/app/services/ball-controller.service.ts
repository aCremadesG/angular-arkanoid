import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BallController } from '../classes/ball-controller';
import { Paddle } from "../interfaces/paddle";

@Injectable({
  providedIn: 'root'
})
export class BallControllerService extends BallController{
  private subject = new Subject<any>();

  ballMovement(cWidth: number, cHeight: number, paddle: Paddle) {
    // rebotar las pelotas en los laterales
    if (
        this.ball.x + this.ball.dx > cWidth - this.ball.ballRadius ||
        this.ball.x + this.ball.dx < this.ball.ballRadius
    ) {
        this.ball.dx = -this.ball.dx
    }
    if (this.ball.y + this.ball.dy < this.ball.ballRadius) {
        this.ball.dy = -this.ball.dy
    }
    // la pelota toca la pala
    const isBallSameXAsPaddle =
        this.ball.x > paddle.x &&
        this.ball.x < paddle.x + paddle.paddleWidth
    const isBallTouchingPaddle = this.ball.y + this.ball.dy > paddle.y

    if (isBallSameXAsPaddle && isBallTouchingPaddle) {
        this.ball.dy = -this.ball.dy // cambiamos la dirección de la pelota
    } else if (this.ball.y + this.ball.dy > cHeight - this.ball.ballRadius || this.ball.y + this.ball.dy > paddle.y + paddle.paddleHeight) {
        console.log('Game Over');
        document.location.reload();
    }
    // mover la pelota
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
    this.sendBall();
  }

  drawBall(ctx: CanvasRenderingContext2D) {
    ctx.beginPath() // iniciar el trazado
    ctx.arc(this.ball.x, this.ball.y, this.ball.ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.closePath() // terminar el trazado
  }

  sendBall(){
    this.subject.next({ball: this.ball});
  }

  getBall(){
    return this.subject.asObservable();
  }
}
