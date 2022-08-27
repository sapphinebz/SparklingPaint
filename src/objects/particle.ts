import { AsyncSubject, Observable, takeWhile } from "rxjs";
import { map, pairwise, takeUntil, tap } from "rxjs/operators";
import { randomMinmax } from "../functions/random-min-max";

export class Particle {
  onDestroy$ = new AsyncSubject<void>();
  x: number = 0;
  y: number = 0;
  radius = 10;
  scaleSpeed = 10;
  speed = 200;
  speedY = randomMinmax(-this.speed, this.speed);
  speedX = randomMinmax(-this.speed, this.speed);
  color: string = "red";

  constructor(
    public ctx: CanvasRenderingContext2D,
    public animationTime$: Observable<{
      timestamp: number;
      elapsed: number;
    }>
  ) {}

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();

    if (this.radius === 0) {
      this.destroy();
    }
  }

  destroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  move() {
    return this.deltaTime((delta) => {
      this.radius -= delta * this.scaleSpeed;
      if (this.radius < 0) {
        this.radius = 0;
      }
      this.x += delta * this.speedX;
      this.y += delta * this.speedY;
    }).pipe(
      tap(() => {
        this.draw();
      }),
      takeUntil(this.onDestroy$)
    );
  }

  deltaTime(project: (delta: number) => void) {
    return this.animationTime$.pipe(
      map((event) => event.elapsed / 1000),
      pairwise(),
      map(([prev, curr]) => {
        return curr - prev;
      }),
      tap((delta) => {
        project(delta);
      })
    );
  }
}
