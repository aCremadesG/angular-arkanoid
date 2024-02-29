import { Ball } from "../interfaces/ball";

export class BallController {
    ball: Ball = {} as Ball;
    dxOptions: Array<number> = [-3,3]

    initBall(width:number , height: number){
        this.ball = {
            ballRadius: 3,
            x: width,
            y: height,
            dx: this.dxOptions[Math.floor(Math.random() * 2)],
            dy: -3
        } as Ball;
    }
}
