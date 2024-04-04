import { fromEvent, retry, takeUntil, tap, timer } from 'rxjs';

const due = 2 * 1000;
const c = fromEvent(window, 'click').pipe(
  tap(() => {
    // 为了触发 retry
    throw new Error('retry');
  }),
);

timer(due)
  .pipe(takeUntil(c), retry())
  .subscribe(() => console.log('finished!'));
