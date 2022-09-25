import { fromEvent, map, takeUntil, switchMap } from 'rxjs';
import { getPoint, getTranslate, mousemove, mouseup, Point, setTranslate } from './utils';

/**
 * 简单拖拽
 */

// 正方形div
const boxDiv = document.querySelector('.box.example-1') as HTMLDivElement;

const mousedown = fromEvent<MouseEvent>(boxDiv, 'mousedown');

mousedown
  .pipe(
    map((e) => [getPoint(e), getTranslate(boxDiv)]),
    // 通过 switchMap 把move事件抬升到down事件下
    switchMap(([domPoint, transPoint]) =>
      mousemove.pipe(
        map((e) => {
          const point = getPoint(e);
          return [point[0] - domPoint[0] + transPoint[0], point[1] - domPoint[1] + transPoint[1]];
        }),
        takeUntil(mouseup),
      ),
    ),
  )
  .subscribe((point) => {
    /* const moveSub = */
    // 取消监听鼠标移动事件； 使用 takeUntil(mouseup) 代替会更加优雅一点
    // mouseup.subscribe(() => moveSub.unsubscribe());
    setTranslate(boxDiv, point as Point);
  });
