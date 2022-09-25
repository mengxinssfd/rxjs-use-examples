import { fromEvent, map, takeUntil, switchMap, interval, zip, startWith, mergeMap } from 'rxjs';
import { getPoint, getTranslate, mousemove, mouseup, Point, setTranslate } from './utils';

/**
 * 拖拽接龙
 */

// boxes
const boxes = document.querySelectorAll('.boxes .box') as NodeListOf<HTMLDivElement>;

const firstBox = boxes[0];

const mousedown = fromEvent<MouseEvent>(firstBox, 'mousedown');

// 使用 zip 把 dom 和 interval 延时链接起来，startWith 让第一个立即启动，最后只要把 box 返回即可
const delayBoxes = zip(boxes, interval(100).pipe(startWith(0))).pipe(map(([box]) => box));

mousedown
  .pipe(
    map((e) => [getPoint(e), getTranslate(firstBox)]),
    switchMap(([domPoint, transPoint]) =>
      mousemove.pipe(
        map((e) => {
          const point = getPoint(e);
          return [point[0] - domPoint[0] + transPoint[0], point[1] - domPoint[1] + transPoint[1]];
        }),
        takeUntil(mouseup),
      ),
    ),
    // 此处若是使用 switchMap 的话，就只会保留最后一个坐标点，不会有动画；
    // 而 mergeMap 会把之前的所有的坐标点都遍历一次
    mergeMap((point) => delayBoxes.pipe(map((box) => [box, point]))),
  )
  .subscribe(([box, point]) => setTranslate(box as HTMLDivElement, point as Point));
