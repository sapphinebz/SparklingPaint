import { animationFrames, fromEvent, mergeMap } from "rxjs";
import { finalize, share, startWith, tap } from "rxjs/operators";
import { randomMinmax } from "./functions/random-min-max";
import { Particle } from "./objects/particle";
import { repeatEvent } from "./operators/repeat-event";

const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
const ctx = canvas.getContext("2d")!;

fromEvent(window, "resize")
  .pipe(
    startWith(0),
    tap(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    })
  )
  .subscribe();

let hue = 0;

const animationTime$ = animationFrames().pipe(
  tap(() => {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgb(0 0 0 / 10%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    hue++;
  }),
  finalize(() => {
    ctx.fillStyle = `rgb(0 0 0 / 100%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }),
  share()
);

fromEvent<MouseEvent>(canvas, "mousemove")
  .pipe(
    repeatEvent(7),
    mergeMap((event) => {
      const particle = new Particle(ctx, animationTime$);
      particle.color = `hsl(${hue}, 100%, 50%)`;
      particle.x = event.x;
      particle.y = event.y;
      particle.radius = randomMinmax(3, 15);
      return particle.move();
    })
  )
  .subscribe();
