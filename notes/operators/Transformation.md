# [转换操作符(Transformation Operators)](https://rxjs.dev/guide/operators#transformation-operators)

- [x] [`buffer`](https://rxjs.dev/api/operators/buffer)

- [x] [`bufferCount`](https://rxjs.dev/api/operators/bufferCount)

- [ ] [`bufferTime`](https://rxjs.dev/api/operators/bufferTime)

- [ ] [`bufferToggle`](https://rxjs.dev/api/operators/bufferToggle)

- [ ] [`bufferWhen`](https://rxjs.dev/api/operators/bufferWhen)

- [ ] [`concatMap`](https://rxjs.dev/api/operators/concatMap)

- [ ] [`concatMapTo`](https://rxjs.dev/api/operators/concatMapTo)

- [ ] [`exhaust`](https://rxjs.dev/api/operators/exhaust)

- [ ] [`exhaustMap`](https://rxjs.dev/api/operators/exhaustMap)

- [ ] [`expand`](https://rxjs.dev/api/operators/expand)

- [ ] [`groupBy`](https://rxjs.dev/api/operators/groupBy)

- [x] [`map`](https://rxjs.dev/api/operators/map)

- [ ] [`mapTo`](https://rxjs.dev/api/operators/mapTo)

- [x] [`mergeMap`](https://rxjs.dev/api/operators/mergeMap)

- [ ] [`mergeMapTo`](https://rxjs.dev/api/operators/mergeMapTo)

- [ ] [`mergeScan`](https://rxjs.dev/api/operators/mergeScan)

- [ ] [`pairwise`](https://rxjs.dev/api/operators/pairwise)

- [x] [`partition`](https://rxjs.dev/api/operators/partition)

- [ ] [`pluck`](https://rxjs.dev/api/operators/pluck)

- [ ] [`scan`](https://rxjs.dev/api/operators/scan)

- [ ] [`switchScan`](https://rxjs.dev/api/operators/switchScan)

- [x] [`switchMap`](https://rxjs.dev/api/operators/switchMap)

- [ ] [`switchMapTo`](https://rxjs.dev/api/operators/switchMapTo)

- [ ] [`window`](https://rxjs.dev/api/operators/window)

- [ ] [`windowCount`](https://rxjs.dev/api/operators/windowCount)

- [ ] [`windowTime`](https://rxjs.dev/api/operators/windowTime)

- [ ] [`windowToggle`](https://rxjs.dev/api/operators/windowToggle)

- [ ] [`windowWhen`](https://rxjs.dev/api/operators/windowWhen)

## [buffer](https://rxjs.dev/api/operators/buffer)

> 缓冲源 Observable 的值，直到 closingNotifier 发出了值才继续。

_将已过去的值收集为一个数组，并仅当另一个 Observable 发出了值后才发送该数组。_

buffer(closingNotifier: Observable): OperatorFunction\<T, T\[]>

### 参数

| closingNotifier | 一个 Observable，它指示何时要在输出 Observable 上发送缓冲区。 |
| :-------------- | :------------------------------------------------------------ |

### 返回值

一个返回 Observable 的函数，该 Observable 的值是一些缓冲区构成的数组。

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/buffer.png)

缓冲传入的 `Observable` 值，直到给定的 `closingNotifier` `Observable` 发出了一个值，此时它会在输出 `Observable` 上发送缓冲区并在内部启动一个新的缓冲区，等待 `closingNotifier` 发出下一个值。

### 例子

每次点击时，发送最近间隔期间所有事件的数组

```typescript
import { fromEvent, interval, buffer } from 'rxjs';

const clicks = fromEvent(document, 'click');
const intervalEvents = interval(1000);
const buffered = intervalEvents.pipe(buffer(clicks));
buffered.subscribe((x) => console.log(x));
```

### 笔记

`buffer`需要两个`Observable`，一个`Observable`用于累计收集到数组，一个`Observable`用于触发外部订阅并把之前收集到的数据发出，并重置累计数组。

## [bufferCount](https://rxjs.dev/api/operators/bufferCount)

> 缓冲源 Observable 值，直到大小达到给定的最大 `bufferSize`。

> _将过去的值收集为一个数组，并仅在其大小达到 `bufferSize` 时发送该数组。_

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/bufferCount.png)

通过 `bufferSize` 缓冲来自源 Observable 的多个值，然后发送缓冲区并清除它，并且每过 `startBufferEvery` 次就启动一个新缓冲区。如果 `startBufferEvery` 未提供或为 `null`，则新缓冲区会在源开始处以及每个缓冲区关闭并发送时启动新缓冲区。

### 参数

| bufferSize       | 发送的缓冲区的最大大小。                                                                                                                                                  |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| startBufferEvery | 可选。默认值为`null`。用于开始新缓冲区的时间间隔。例如，如果 startBufferEvery 是 2 ，那么将在源的每个其他值上启动一个新缓冲区。默认情况下，会在源的开头启动一个新缓冲区。 |

### 例子

将最后两个点击事件作为数组进行发送

```typescript
import { fromEvent, bufferCount } from 'rxjs';

const clicks = fromEvent(document, 'click');
const buffered = clicks.pipe(bufferCount(2));
buffered.subscribe((x) => console.log(x));
```

每次单击时，将最后两个单击事件作为数组发送

```typescript
import { fromEvent, bufferCount } from 'rxjs';

const clicks = fromEvent(document, 'click');
const buffered = clicks.pipe(bufferCount(2, 1));
buffered.subscribe((x) => console.log(x));
```

### 笔记

跟`buffer`类似，不过需要`bufferCount`设置缓冲区大小，只有缓冲区满了才会触发外部订阅。

还可以设置缓冲区满了后间隔多少个才触发外部订阅，默认是缓冲区多大就间隔多少个，也可以设置为 1 个，那样缓冲区满了以后每次都是发出最后两个，也可以设置更多个。

## [map](https://rxjs.dev/api/operators/map)

> 与 [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 一样，它会针对传入的每个源值调用转换函数，以获取相应的输出值。

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/map.png)

### 例子

将每次点击映射为该点击的 `clientX` 位置

```typescript
import { fromEvent, map } from 'rxjs';

const clicks = fromEvent<PointerEvent>(document, 'click');
const positions = clicks.pipe(map((ev) => ev.clientX));

positions.subscribe((x) => console.log(x));
```

### 笔记

与[Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 一样，所以不需要额外理解了，在此不再赘述

## &#x20;[partition](https://rxjs.dev/api/operators/partition)

> 将源 Observable 拆分为两个，一个具有满足此谓词的值，另一个具有不满足此谓词的值。
>
> > _它类似于 [`filter`](https://rxjs.tech/api/operators/filter)，但会返回两个 Observable：一个类似于 [`filter`](https://rxjs.tech/api/operators/filter) 的输出，另一个则具有不满足条件的值。_

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/partition.png)

### 例子

将点击事件划分为 DIV 元素上的事件和其它地方的事件

```typescript
import { fromEvent } from 'rxjs';
import { partition } from 'rxjs/operators';

const div = document.createElement('div');
div.style.cssText = 'width: 200px; height: 200px; background: #09c;';
document.body.appendChild(div);

const clicks = fromEvent(document, 'click');
const [clicksOnDivs, clicksElsewhere] = clicks.pipe(
  partition((ev) => (<HTMLElement>ev.target).tagName === 'DIV'),
);

clicksOnDivs.subscribe((x) => console.log('DIV clicked: ', x));
clicksElsewhere.subscribe((x) => console.log('Other clicked: ', x));
```

### 笔记

和大部分操作符不一样，`partition`会返回两个`Observable`: `[true, false]`

## &#x20;[switchMap](https://rxjs.dev/api/index/function/switchMap)

> 将每个源值投影到一个 Observable，该 Observable 会合并到输出 Observable 中，仅从最近投影的 Observable 中发出值。

> _将每个值映射到一个 Observable，然后展平所有这些内部 Observable。_

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/switchMap.png)

### 例子

#### 例 1：根据源 Observable 值生成新的 Observable

```typescript
import { of, switchMap } from 'rxjs';

const switched = of(1, 2, 3).pipe(switchMap((x) => of(x, x ** 2, x ** 3)));
switched.subscribe((x) => console.log(x));
// outputs
// 1
// 1
// 1
// 2
// 4
// 8
// 3
// 9
// 27
```

#### &#x20;例 2: 在每个点击事件上重新启动一个定期重复 Observable

```typescript
import { fromEvent, switchMap, interval } from 'rxjs';

const clicks = fromEvent(document, 'click');
const result = clicks.pipe(switchMap(() => interval(1000)));
result.subscribe((x) => console.log(x));
```

### 笔记

从`例1`的`outputs`可以看出：`switchMap`是类似于展开操作:

1 展开为 1，1，1；

2 展开为 2，4，8

3 展开为 3，9，27

并且合并到一起输出，类似于把数组合并后再遍历输出

不过`例2`这里有点问题，把`例2`改为以下：

```typescript
const clicks = fromEvent(document, 'click');
const result = clicks.pipe(
  switchMap(() => {
    const i = interval(1000);
    i.subscribe({
      next(v) {
        console.log('interval next', v);
      },
      complete() {
        console.log('interval complete');
      },
    });
    return i;
  }),
);
result.subscribe((x) => console.log(x));

// outputs
// 第一次点击
// interval next 0
// 0
//  interval next 1
// 1
//  interval next 2
// 2
//  interval next 3
// 3
//  interval next 4

// 第二次点击
//  interval next 0
// 0
//  interval next 5
//  interval next 1
// 1
//  interval next 6
//  interval next 2
// 2
//  interval next 7
//  interval next 3
// 3
//  interval next 8
//  interval next 4
// 4
//  interval next 9
//  interval next 5
// 第3次点击
//  interval next 0
// 0
//  interval next 10
//  interval next 6
```

会发现虽然最后订阅的没数字没错，但是每一次点击`interval`都会生成一个`Observable`

再改一次订阅

const sub = result.subscribe((x) => {
console.log(x);
if (x > 10) sub.unsubscribe();
});
当`x`大于`10`的时候停止订阅，发现打印`x`已经停止了，但是`interval`依然还是在执行中，并没有`complete`

在此需要注意一下

## &#x20;[mergeMap](https://rxjs.dev/api/index/function/mergeMap)

> 将每个源值投影到一个 Observable，该 Observable 会被合并到输出 Observable 中。 &#x20;

> _将每个值映射到一个 Observable，然后使用 [`mergeAll`](https://rxjs.tech/api/index/function/mergeAll) 展平所有这些内部 Observable。_

### 弹珠图

![](https://rxjs.dev/assets/images/marble-diagrams/mergeMap.png)

### 例子

将每个字母映射为一个每秒发送一个条目的 Observable 并展平

```typescript
import { of, mergeMap, interval, map } from 'rxjs';

const letters = of('a', 'b', 'c');
const result = letters.pipe(mergeMap((x) => interval(1000).pipe(map((i) => x + i))));

result.subscribe((x) => console.log(x));

// Results in the following:
// a0
// b0
// c0
// a1
// b1
// c1
// continues to list a, b, c every second with respective ascending integers
```

### 笔记

`mergeMap`从例子上看似乎和`switchMap`没什么两样，把`mergeMap`替换成`switchMap`，发现输出是不一样的:

```typescript
const letters = of('a', 'b', 'c');
const result = letters.pipe(switchMap((x) => interval(1000).pipe(map((i) => x + i))));

result.subscribe((x) => console.log(x));

// outputs
// c0
// c1
// c2
// c3
// c4
// c5
```

可以发现这时的`x`始终是`c`&#x20;

两者之间的区别：

|                            | mergeMap     | switchMap      |
| :------------------------- | :----------- | :------------- |
| 是否等待 interval 一起启动 | 是           | 否             |
| 遍历结束后循环方式         | 重新开始遍历 | 只保留最后一位 |
