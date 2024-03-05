import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PaddleController } from '../classes/paddle-controller';

@Injectable({
  providedIn: 'root'
})
export class PaddleControllerService extends PaddleController{
  private subject = new Subject<any>();

  paddleMovement(cWidth: number) {
    if (this.paddle.rightPressed && this.paddle.x < cWidth - this.paddle.paddleWidth) {
      this.paddle.x += this.paddle.PADDLE_SENSITIVITY
    } else if (this.paddle.leftPressed && this.paddle.x > 0) {
      this.paddle.x -= this.paddle.PADDLE_SENSITIVITY
    }
    this.sendPaddle()
  }

  drawPaddle(ctx: CanvasRenderingContext2D, img: CanvasImageSource) {
    ctx!.drawImage(
      img, // imagen
      29, // clipX: coordenadas de recorte
      174, // clipY: coordenadas de recorte
      this.paddle.paddleWidth, // el tamaño del recorte
      this.paddle.paddleHeight, // tamaño del recorte
      this.paddle.x, // posición X del dibujo
      this.paddle.y, // posición Y del dibujo
      this.paddle.paddleWidth, // ancho del dibujo
      this.paddle.paddleHeight // alto del dibujo
    )
  }

  setRightPressed(state: boolean){
    this.paddle.rightPressed = state;
  }

  setLeftPressed(state: boolean){
    this.paddle.leftPressed = state;
  }
  
  sendPaddle(){
    this.subject.next({paddle: this.paddle});
  }

  getPaddle(){
    return this.subject.asObservable();
  }
}
