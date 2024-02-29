import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { Brick } from '../../interfaces/brick';
import { Paddle } from '../../interfaces/paddle';

@Component({
  selector: 'app-videogame',
  standalone: true,
  imports: [],
  templateUrl: './videogame.component.html',
  styleUrl: './videogame.component.scss'
})
export class VideogameComponent implements AfterViewInit {
  /* Variables de nuestro juego */
  @ViewChild('canvas')
  canvas!: ElementRef;
  ctx: CanvasRenderingContext2D | null | undefined;
  @ViewChild('sprite') $sprite!: ElementRef;
  @ViewChild('bricks') $bricks!: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) { 
    const { key } = event
    if (key === 'Right' || key === 'ArrowRight' || key.toLowerCase() === 'd') {
      this.rightPressed = true
    } else if (key === 'Left' || key === 'ArrowLeft' || key.toLowerCase() === 'a') {
      this.leftPressed = true
    }
  }
  @HostListener('document:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) { 
    const { key } = event
    if (key === 'Right' || key === 'ArrowRight' || key.toLowerCase() === 'd') {
      this.rightPressed = false
    } else if (key === 'Left' || key === 'ArrowLeft' || key.toLowerCase() === 'a') {
      this.leftPressed = false
    }
  }

  /* VARIABLES DE LA PELOTA */
  ballRadius = 3;
  // posicion de la pelota
  x = 0;
  y = 0;
  // velocidad de la pelota
  dx = -3;
  dy = -3;

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

  rightPressed = false;
  leftPressed = false;
  
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

  ngAfterViewInit(): void {
    let canvasWidth = (this.canvas.nativeElement as HTMLCanvasElement).width;
    let canvasHeight = (this.canvas.nativeElement as HTMLCanvasElement).height;
    this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.x = canvasWidth / 2;
    this.y = canvasHeight - 30;
    this.paddle.x = (canvasWidth - this.paddle.paddleWidth) / 2;
    this.paddle.y = canvasHeight - this.paddle.paddleHeight - 10;
    
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
    this.drawBall()
    this.drawPaddle()
    this.drawBricks()
    this.drawUI()

    // colisiones y movimientos
    this.collisionDetection()
    //this.ballMovement()
    this.paddleMovement()
  }

  collisionDetection() {
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        const currentBrick = this.bricks[c][r]
        if (currentBrick.status === this.BRICK_STATUS.DESTROYED) continue;

        const isBallSameXAsBrick =
          this.x > currentBrick.x &&
          this.x < currentBrick.x + this.brickWidth

        const isBallSameYAsBrick =
          this.y > currentBrick.y &&
          this.y < currentBrick.y + this.brickHeight

        if (isBallSameXAsBrick && isBallSameYAsBrick) {
          this.dy = -this.dy
          currentBrick.status = this.BRICK_STATUS.DESTROYED
        }
      }
    }
  }

  drawUI() {
    this.ctx!.fillText(`FPS: ${this.framesPerSec}`, 5, 10);
  }

  
  cleanCanvas() {
    this.ctx!.clearRect(0, 0, (this.canvas.nativeElement as HTMLCanvasElement).width, (this.canvas.nativeElement as HTMLCanvasElement).height)
  }

  ballMovement() {
    // rebotar las pelotas en los laterales
    if (
      this.x + this.dx > (this.canvas.nativeElement as HTMLCanvasElement).width - this.ballRadius || // la pared derecha
      this.x + this.dx < this.ballRadius // la pared izquierda
    ) {
      this.dx = -this.dx
    }

    // rebotar en la parte de arriba
    if (this.y + this.dy < this.ballRadius) {
      this.dy = -this.dy
    }

    // la pelota toca la pala
    const isBallSameXAsPaddle =
      this.x > this.paddle.x &&
      this.x < this.paddle.x + this.paddle.paddleWidth

    const isBallTouchingPaddle = this.y + this.dy > this.paddle.y

    if (isBallSameXAsPaddle && isBallTouchingPaddle) {
      this.dy = -this.dy // cambiamos la dirección de la pelota
    } else if ( // la pelota toca el suelo
    this.y + this.dy > (this.canvas.nativeElement as HTMLCanvasElement).height - this.ballRadius || this.y + this.dy > this.paddle.y + this.paddle.paddleHeight
    ) {
      console.log('Game Over')
      document.location.reload()
    }

    // mover la pelota
    this.x += this.dx
    this.y += this.dy
  }
  
  drawBall() {
    this.ctx!.beginPath() // iniciar el trazado
    this.ctx!.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2)
    this.ctx!.fillStyle = '#fff'
    this.ctx!.fill()
    this.ctx!.closePath() // terminar el trazado
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
    if (this.rightPressed && this.paddle.x < (this.canvas.nativeElement as HTMLCanvasElement).width - this.paddle.paddleWidth) {
      this.paddle.x += this.paddle.PADDLE_SENSITIVITY
    } else if (this.leftPressed && this.paddle.x > 0) {
      this.paddle.x -= this.paddle.PADDLE_SENSITIVITY
    }
  }
}
