import { fromEvent, map, takeUntil, switchMap, delay, tap, of } from 'rxjs';
import { getPoint, getTranslate, mousemove, mouseup, Point, setTranslate } from './utils';

/**
 * 简单拖拽 添加初始延迟
 */

// 正方形div
const boxDiv = document.querySelector('.box.example-2') as HTMLDivElement;

const mousedown = fromEvent<MouseEvent>(boxDiv, 'mousedown');

mousedown
  .pipe(
    // 通过switchMap，把控制权转为函数内部，并把内部事件抬升到外部
    switchMap((e) => {
      // 使用of生成新的Observable，并添加延时以及设置无效条件
      return of(e).pipe(
        delay(500),
        takeUntil(mousemove),
        map((e) => [getPoint(e), getTranslate(boxDiv)]),
      );
    }),
    // 通过 switchMap 把move事件抬升到down事件下
    switchMap(([domPoint, transPoint]) => {
      // 添加 class blink
      boxDiv.classList.add('blink');
      return mousemove.pipe(
        map((e) => {
          const point = getPoint(e);
          return [point[0] - domPoint[0] + transPoint[0], point[1] - domPoint[1] + transPoint[1]];
        }),
        takeUntil(
          mouseup.pipe(
            // 释放鼠标的同时移除 class blink
            tap(() => boxDiv.classList.remove('blink')),
          ),
        ),
      );
    }),
  )
  .subscribe((point) => {
    /* const moveSub = */
    // 取消监听鼠标移动事件； 使用 takeUntil(mouseup) 代替会更加优雅一点
    // mouseup.subscribe(() => moveSub.unsubscribe());
    setTranslate(boxDiv, point as Point);
  });
