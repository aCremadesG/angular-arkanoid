import { Paddle } from "../interfaces/paddle";

export class PaddleController {
    paddle: Paddle = {} as Paddle

    initPaddle(cWidth: number, cHeight: number){
        this.paddle = {
            PADDLE_SENSITIVITY: 8,
            paddleHeight: 10,
            paddleWidth: 50,
            x: 0,
            y: 0,
            rightPressed: false,
            leftPressed: false
        } as Paddle
        this.paddle.x = (cWidth - this.paddle.paddleWidth) / 2
        this.paddle.y = cHeight - this.paddle.paddleHeight - 10
    }
}
