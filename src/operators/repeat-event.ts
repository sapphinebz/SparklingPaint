import { Observable } from "rxjs";

export function repeatEvent<T>(time: number) {
  return (source: Observable<T>) =>
    new Observable<T>((subscriber) => {
      return source.subscribe({
        next: (value: T) => {
          let i = 0;
          while (i < time) {
            subscriber.next(value);
            i++;
          }
        },
        error: (err) => {
          subscriber.error(err);
        },
        complete: () => {
          subscriber.complete();
        },
      });
    });
}
