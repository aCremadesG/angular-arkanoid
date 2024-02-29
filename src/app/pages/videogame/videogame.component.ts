import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { Brick } from '../../interfaces/brick';
import { Paddle } from '../../interfaces/paddle';
import { Ball } from '../../interfaces/ball';
import { BallControllerService } from '../../services/ball-controller.service';

@Component({
  selector: 'app-videogame',
  standalone: true,
  imports: [],
  templateUrl: './videogame.component.html',
  styleUrl: './videogame.component.scss'
})
export class VideogameComponent implements AfterViewInit {
  constructor(
    private ballControllerService: BallControllerService
  ){}
  /* Variables de nuestro juego */
  @ViewChild('canvas')
  canvas!: ElementRef;
  cWidth: number = 0;
  cHeight: number = 0;
  ctx: CanvasRenderingContext2D | null | undefined;
  @ViewChild('sprite') $sprite!: ElementRef;
  @ViewChild('bricks') $bricks!: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) { 
    const { key } = event
    if (key === 'Right' || key === 'ArrowRight' || key.toLowerCase() === 'd') {
      this.paddle.rightPressed = true
    } else if (key === 'Left' || key === 'ArrowLeft' || key.toLowerCase() === 'a') {
      this.paddle.leftPressed = true
    }
    console.log(key);
  }
  @HostListener('document:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) { 
    const { key } = event
    if (key === 'Right' || key === 'ArrowRight' || key.toLowerCase() === 'd') {
      this.paddle.rightPressed = false
    } else if (key === 'Left' || key === 'ArrowLeft' || key.toLowerCase() === 'a') {
      this.paddle.leftPressed = false
    }
  }

  /* VARIABLES DE LA PELOTA */
  ball: Ball = {} as Ball

  /* VARIABLES DE LA PALETA */
  paddle: Paddle = {
    PADDLE_SENSITIVITY: 8,
    paddleHeight: 10,
    paddleWidth: 50,
    x: 0,
    y: 0,
    rightPressed: false,
    leftPressed: false
  } as Paddle
  
  /* VARIABLES DE LOS LADRILLOS */
  brickRowCount = 6;
  brickColumnCount = 13;
  brickWidth = 32;
  brickHeight = 16;
  brickPadding = 0;
  brickOffsetTop = 80;
  brickOffsetLeft = 16;
  bricks: Array<Array<Brick>> = [[]];

  BRICK_STATUS = {
    ACTIVE: 1,
    DESTROYED: 0
  }

  // a que velocidad de fps queremos que renderice nuestro juego
  fps = 60
  
  msPrev = window.performance.now()
  msFPSPrev = window.performance.now() + 1000;
  msPerFrame = 1000 / this.fps
  frames = 0
  framesPerSec = this.fps;

  ngOnInit(){
    this.ballControllerService.getBall().subscribe(res =>{
      this.ball = res.ball;
    })
  }

  ngAfterViewInit(): void {
    this.cWidth = (this.canvas.nativeElement as HTMLCanvasElement).width;
    this.cHeight = (this.canvas.nativeElement as HTMLCanvasElement).height;
    this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.ballControllerService.initBall(this.cWidth / 2, this.cHeight - 30);
    this.ball.x = this.cWidth / 2;
    this.ball.y = this.cHeight - 30;
    this.paddle.x = (this.cWidth - this.paddle.paddleWidth) / 2;
    this.paddle.y = this.cHeight - this.paddle.paddleHeight - 10;
    for (let c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = [] // inicializamos con un array vacio
      for (let r = 0; r < this.brickRowCount; r++) {
        // calculamos la posicion del ladrillo en la pantalla
        const brickX = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft
        const brickY = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop
        // Asignar un color aleatorio a cada ladrillo
        const random = Math.floor(Math.random() * 8)
        // Guardamos la información de cada ladrillo
        this.bricks[c][r] = {
          x: brickX,
          y: brickY,
          status: this.BRICK_STATUS.ACTIVE,
          color: random
        }
      }
    }
    this.draw();
  }

  draw() {
    requestAnimationFrame(this.draw.bind(this));
    const msNow = window.performance.now()
    const msPassed = msNow - this.msPrev
    if (msPassed < this.msPerFrame) return
    const excessTime = msPassed % this.msPerFrame
    this.msPrev = msNow - excessTime
    this.frames++
    if (this.msFPSPrev < msNow)
    {
      this.msFPSPrev = window.performance.now() + 1000
      this.framesPerSec = this.frames;
      this.frames = 0;
    }
    // ... render code
    this.cleanCanvas()
    // hay que dibujar los elementos
    this.ballControllerService.drawBall(this.ctx!)
    this.drawPaddle()
    this.drawBricks()
    this.drawUI()
    // colisiones y movimientos
    this.collisionDetection()
    this.ballControllerService.ballMovement(this.cWidth, this.cHeight, this.paddle);
    this.paddleMovement()
  }

  collisionDetection() {
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        const currentBrick = this.bricks[c][r]
        if (currentBrick.status === this.BRICK_STATUS.DESTROYED) continue;
        const isBallSameXAsBrick =
          this.ball.x > currentBrick.x &&
          this.ball.x < currentBrick.x + this.brickWidth
        const isBallSameYAsBrick =
          this.ball.y > currentBrick.y &&
          this.ball.y < currentBrick.y + this.brickHeight
        if (isBallSameXAsBrick && isBallSameYAsBrick) {
          this.ball.dy = -this.ball.dy
          currentBrick.status = this.BRICK_STATUS.DESTROYED
        }
      }
    }
  }

  drawUI() {
    this.ctx!.fillText(`FPS: ${this.framesPerSec}`, 5, 10);
  }

  
  cleanCanvas() {
    this.ctx!.clearRect(0, 0, this.cWidth, this.cHeight)
  }
  
  drawPaddle() {
    this.ctx!.drawImage(
      this.$sprite!.nativeElement, // imagen
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

  drawBricks() {
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        const currentBrick = this.bricks[c][r]
        if (currentBrick.status === this.BRICK_STATUS.DESTROYED) continue;
        const clipX = currentBrick.color * 32
        this.ctx!.drawImage(
          this.$bricks!.nativeElement,
          clipX,
          0,
          this.brickWidth, // 31
          this.brickHeight, // 14
          currentBrick.x,
          currentBrick.y,
          this.brickWidth,
          this.brickHeight
        )
      }
    }
  }

  paddleMovement() {
    if (this.paddle.rightPressed && this.paddle.x < this.cWidth - this.paddle.paddleWidth) {
      this.paddle.x += this.paddle.PADDLE_SENSITIVITY
    } else if (this.paddle.leftPressed && this.paddle.x > 0) {
      this.paddle.x -= this.paddle.PADDLE_SENSITIVITY
    }
  }
}
