import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { Brick } from '../../interfaces/brick';
import { Paddle } from '../../interfaces/paddle';
import { Ball } from '../../interfaces/ball';
import { BallControllerService } from '../../services/ball-controller.service';
import { PaddleControllerService } from '../../services/paddle-controller.service';
import { Subscription } from 'rxjs';
import { PowerUp } from '../../interfaces/power-up';
import { LevelControllerService } from '../../services/level-controller.service';

@Component({
  selector: 'app-videogame',
  standalone: true,
  imports: [],
  templateUrl: './videogame.component.html',
  styleUrl: './videogame.component.scss'
})
export class VideogameComponent implements AfterViewInit {
  constructor(
    private ballControllerService: BallControllerService,
    private paddleControllerService: PaddleControllerService,
    private levelControllerService: LevelControllerService
  ){
    this.ballSubscription = this.ballControllerService.getBall().subscribe(res =>{
      this.ball = res.ball;
    })
    this.paddleSubscription = this.paddleControllerService.getPaddle().subscribe(res => {
      this.paddle = res.paddle;
    })
  }
  /* Variables de nuestro juego */
  @ViewChild('canvas')
  canvas!: ElementRef;
  cWidth: number = 0;
  cHeight: number = 0;
  points: number = 0;
  level: number = 0;
  ctx: CanvasRenderingContext2D | null | undefined;
  @ViewChild('sprite') $sprite!: ElementRef;
  @ViewChild('bricks') $bricks!: ElementRef;

  /*Primera version de una maquina de estados*/
  gamePaused = false;

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) { 
    const { key } = event
    if (key === 'Right' || key === 'ArrowRight' || key.toLowerCase() === 'd') {
      this.paddleControllerService.setRightPressed(true);
    } else if (key === 'Left' || key === 'ArrowLeft' || key.toLowerCase() === 'a') {
      this.paddleControllerService.setLeftPressed(true);
    } else if(key === 'Escape'){
      this.gamePaused = !this.gamePaused
    }
  }
  @HostListener('document:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) { 
    const { key } = event
    if (key === 'Right' || key === 'ArrowRight' || key.toLowerCase() === 'd') {
      this.paddleControllerService.setRightPressed(false);
    } else if (key === 'Left' || key === 'ArrowLeft' || key.toLowerCase() === 'a') {
      this.paddleControllerService.setLeftPressed(false);
    }
  }

  /* VARIABLES DE LA PELOTA */
  ball: Ball = {} as Ball

  /* VARIABLES DE LA PALETA */
  paddle: Paddle = {} as Paddle
  
  /* VARIABLES DE LOS LADRILLOS */
  brickWidth = 32;
  brickHeight = 16;
  brickPadding = 0;
  brickOffsetTop = 80;
  brickOffsetLeft = 16;
  bricks: Brick[] = [];

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

  // variables de subscripción a los servicios
  ballSubscription: Subscription;
  paddleSubscription: Subscription;

  ngAfterViewInit(): void {
    this.cWidth = (this.canvas.nativeElement as HTMLCanvasElement).width;
    this.cHeight = (this.canvas.nativeElement as HTMLCanvasElement).height;
    this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.ballControllerService.initBall(this.cWidth / 2, this.cHeight - 30);
    this.paddleControllerService.initPaddle(this.cWidth, this.cHeight);
    //this.loadDefaultLevel();
    this.loadLevel();
    this.draw();
  }

  loadLevel() {
    const level = this.levelControllerService.getLevel(this.level);
    this.bricks = level.bricks
    this.brickWidth = level.brickWidth;
    this.brickHeight = level.brickHeight;
  }

  ngOnDestroy() {
    this.ballSubscription.unsubscribe()
    this.paddleSubscription.unsubscribe()
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
    this.paddleControllerService.drawPaddle(this.ctx!, this.$sprite!.nativeElement);
    this.drawBricks()
    this.drawUI()
    if(this.gamePaused){
      this.playState()
    }else{
      this.pauseState()
    }
  }

  pauseState(){
    this.drawLetter();
  }

  playState(){
    // colisiones y movimientos
    this.collisionDetection()
    this.ballControllerService.ballMovement(this.cWidth, this.cHeight, this.paddle);
    this.paddleControllerService.paddleMovement(this.cWidth);
  }

  collisionDetection() {
    const bricksCount = this.bricks.length;
    for (let r = 0; r < bricksCount; r++) {
      const currentBrick = this.bricks[r]
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
        this.points += 100;
      }
    }
  }

  drawUI() {
    this.ctx!.fillText(`FPS: ${this.framesPerSec}`, 5, 10);
  }

  
  cleanCanvas() {
    this.ctx!.clearRect(0, 0, this.cWidth, this.cHeight)
  }

  pauseArray = [{x: 309, y:93},{x: 273, y:75},{x: 309, y:102},{x: 291, y:102},{x: 309, y:75}]

  drawLetter() {
    this.pauseArray.map((letter, i) => {
      this.ctx!.drawImage(
        this.$sprite!.nativeElement, // imagen
        letter.x, // clipX: coordenadas de recorte
        letter.y, // clipY: coordenadas de recorte
        9, // el tamaño del recorte
        8, // tamaño del recorte
        ((this.cWidth / 2) - 23) + (10 * i), // posición X del dibujo
        220, // posición Y del dibujo
        9, // ancho del dibujo
        8 // alto del dibujo
      )
    })
  }

  drawBricks() {
    const brickRowCount = this.bricks.length;
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = this.bricks[r]
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
