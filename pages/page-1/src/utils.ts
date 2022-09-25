import { fromEvent } from 'rxjs';

export type Point = [x: number, y: number];

export const getPoint = (e: MouseEvent): Point => [e.clientX, e.clientY];

export function getTranslate(element: HTMLElement): Point {
  const style = getComputedStyle(element);
  const regExp = /matrix\((-?\d+,\s){4}(-?\d+),\s(-?\d+)/i;
  const result = style.transform.match(regExp);
  return result ? [parseInt(result[2]), parseInt(result[3])] : [0, 0];
}

export function setTranslate(element: HTMLElement, point: Point) {
  element.style.transform = `translate(${point[0]}px, ${point[1]}px)`;
}

export const mousemove = fromEvent<MouseEvent>(document, 'mousemove');
export const mouseup = fromEvent<MouseEvent>(document, 'mouseup');
