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
- [x] [`expand`](https://rxjs.dev/api/operators/expand)
- [x] [`groupBy`](https://rxjs.dev/api/operators/groupBy)
- [x] [`map`](https://rxjs.dev/api/operators/map)
- [ ] [`mapTo`](https://rxjs.dev/api/operators/mapTo)
- [x] [`mergeMap`](https://rxjs.dev/api/operators/mergeMap)
- [ ] [`mergeMapTo`](https://rxjs.dev/api/operators/mergeMapTo)
- [ ] [`mergeScan`](https://rxjs.dev/api/operators/mergeScan)
- [ ] [`pairwise`](https://rxjs.dev/api/operators/pairwise)
- [x] [`partition`](https://rxjs.dev/api/operators/partition)
- [x] [`pluck`](https://rxjs.dev/api/operators/pluck)
- [x] [`scan`](https://rxjs.dev/api/operators/scan)
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

## [partition](https://rxjs.dev/api/operators/partition)

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

## [switchMap](https://rxjs.dev/api/index/function/switchMap)

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

#### 例 2: 在每个点击事件上重新启动一个定期重复 Observable

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

## [mergeMap](https://rxjs.dev/api/index/function/mergeMap)

> 将每个源值投影到一个 Observable，该 Observable 会被合并到输出 Observable 中。

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

可以发现这时的`x`始终是`c`

两者之间的区别：

|                                            | mergeMap     | switchMap                                                                       |
| :----------------------------------------- | :----------- | :------------------------------------------------------------------------------ |
| 是否等待 interval 一起启动                 | 是           | 否                                                                              |
| 如果接收的参数是`Observable`，见 `groupBy` | 正常发送     | 停止从之前发送的内部`Observable` 中发送条目，并开始从新的 `Observable` 发送条目 |
| 遍历结束后循环方式                         | 重新开始遍历 | 只保留最后一位                                                                  |

## [expand](https://rxjs.dev/api/operators/expand)

> 递归地将每个源值投影为一个 Observable，该 Observable 会被合并到输出 Observable 中。

> 它类似于 [`mergeMap`](https://rxjs.tech/api/operators/mergeMap)，但会将投影函数应用于每个源值以及每个输出值。它是递归的。

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/expand.png)

返回一个 Observable，该 Observable 将针对源 Observable 发出的每个条目调用某个函数，该函数会返回一个 Observable，然后合并这些结果 Observable，并发送其所有条目。_expand_ 会在输出 Observable 上重新发送每个源的每个值。然后，对每个输出值调用 `project` 函数，该函数会返回一个内部 Observable，并将其合并到输出 Observable 上。此投影产生的那些输出值也会再传给 `project` 函数以产生新的输出值。这就是 _expand_ 的递归式行为。

### 例子

~~每次~~(每次这个说法是不对的，使用了 `take` 就意味着达到条件后就取消了订阅，该点击事件就无效了)点击时开始发送 2 的幂，最多 10 个

```typescript
import { fromEvent, map, expand, of, delay, take } from 'rxjs';

const clicks = fromEvent(document, 'click');
const powersOfTwo = clicks.pipe(
  map(() => 1),
  expand((x) => of(2 * x).pipe(delay(1000))),
  take(10),
);
powersOfTwo.subscribe((x) => console.log(x));
```

### 笔记

感觉`expand`这个名词有点误导性，它不是扩展而是递归：
**第一次接收上一个操作符传来的参数，然后递归接收上次递归调用的返回值**。

需要注意添加递归停止条件，否则可能会导致栈溢出。

## [groupBy](https://rxjs.dev/api/operators/groupBy)

根据指定的标准对 Observable 发送的条目进行分组，并将这些分组后的条目作为 `GroupedObservables` 发送，每组都对应一个 [`GroupedObservable`](https://rxjs.tech/api/index/interface/GroupedObservable)。

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/groupBy.png)

当 Observable 发送一个条目时，使用 key 函数为这个条目计算出一个键。

如果此键的 [`GroupedObservable`](https://rxjs.tech/api/index/interface/GroupedObservable) 存在，则发送此 [`GroupedObservable`](https://rxjs.tech/api/index/interface/GroupedObservable) 。否则，将为该键创建一个新的 [`GroupedObservable`](https://rxjs.tech/api/index/interface/GroupedObservable) 并发送。

表示属于拥有共有键的分组的值。此共有键可用作 [`GroupedObservable`](https://rxjs.tech/api/index/interface/GroupedObservable) 实例的 `key` 字段。

[`GroupedObservable`](https://rxjs.tech/api/index/interface/GroupedObservable)

发送的元素默认是此 Observable 发送的条目，或是由 element 函数返回的元素。

### 例子

按 `id` 对一些对象进行分组并以数组形式返回

```typescript
import { of, groupBy, mergeMap, reduce } from 'rxjs';

of(
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'Parcel' },
  { id: 2, name: 'webpack' },
  { id: 1, name: 'TypeScript' },
  { id: 3, name: 'TSLint' },
)
  .pipe(
    groupBy((p) => p.id),
    mergeMap((group$) =>
      group$.pipe(reduce((acc, cur) => [...acc, cur], [] as Array<{ id: number; name: string }>)),
    ),
  )
  .subscribe((p) => console.log(p));

// displays:
// [{ id: 1, name: 'JavaScript' }, { id: 1, name: 'TypeScript'}]
// [{ id: 2, name: 'Parcel' }, { id: 2, name: 'webpack'}]
// [{ id: 3, name: 'TSLint' }]
```

由于`groupBy`发出的是`Observable`，所以需要`mergeMap`和`reduce`聚合起来

在 `id` 字段上透视数据

```typescript
import { of, groupBy, mergeMap, reduce, map } from 'rxjs';

of(
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'Parcel' },
  { id: 2, name: 'webpack' },
  { id: 1, name: 'TypeScript' },
  { id: 3, name: 'TSLint' },
)
  .pipe(
    groupBy((p) => p.id, { element: (p) => p.name }),
    mergeMap((group$) => group$.pipe(reduce((acc, cur) => [...acc, cur], [`${group$.key}`]))),
    map((arr) => ({ id: parseInt(arr[0], 10), values: arr.slice(1) })),
  )
  .subscribe((p) => console.log(p));

// displays:
// { id: 1, values: [ 'JavaScript', 'TypeScript' ] }
// { id: 2, values: [ 'Parcel', 'webpack' ] }
// { id: 3, values: [ 'TSLint' ] }
```

### 笔记

与`lodash`的`groupBy`类似的功能，通过条件把数组中的 item 分组。

`rxjs`的`groupBy`因为转换的目标是`Observable`所以如果要转数组的话要多操作一步。

## [scan](https://rxjs.dev/api/operators/scan)

> 用于封装和管理状态。在使用 `seed` 值（第二个参数）或来自源的第一个值建立了初始状态之后，对来自源的每个值调用累加器（或“reducer 函数”）

> _类似于 [`reduce`](https://rxjs.tech/api/operators/reduce)，但在每次更新后会发送当前的累积状态_

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/scan.png)

该操作符会维护一个内部状态，并在处理每个值后发送它，如下所示：

1. 第一个值抵达

- 如果提供了 `seed` 值（作为 [`scan`](https://rxjs.tech/api/index/function/scan) 的第二个参数），则让 `state = seed` 和 `value = firstValue`。
- 如果没有提供 `seed` 值（没有第二个参数），则让 `state = firstValue` 并转到 3。

1. 让 `state = accumulator(state, value)`。

- 如果 `accumulator` 抛出错误，则向使用者通知一个错误。该过程结束。

1. 发送 `state`。
2. 下一个值抵达，让 `value = nextValue`，转到 2。

### 例子

先前数字的平均值。此示例显示了如果不提供 `seed` 就会使用来自源的第一个值来初始化流。

```typescript
import { of, scan, map } from 'rxjs';

const numbers$ = of(1, 2, 3);

numbers$
  .pipe(
    // Get the sum of the numbers coming in.
    scan((total, n) => total + n),
    // Get the average by dividing the sum by the total number
    // received so var (which is 1 more than the zero-based index).
    map((sum, index) => sum / (index + 1)),
  )
  .subscribe(console.log);

// logs
// 1
// 1.5
// 2
```

斐波那契数列。这个例子展示了如何使用种子来启动积累过程。另外，你懂的，斐波那契对于计算机和同事们非常重要，以至于它常常在求职面试中写在白板上。现在你可以向他们秀一下 Rx 版本了！（别当真，哈哈）

```typescript
import { interval, scan, map, startWith } from 'rxjs';

const firstTwoFibs = [0, 1];
// An endless stream of Fibonacci numbers.
const fibonacci$ = interval(1000).pipe(
  // Scan to get the fibonacci numbers (after 0, 1)
  scan(([a, b]) => [b, a + b], firstTwoFibs),
  // Get the second number in the tuple, it's the one you calculated
  map(([, n]) => n),
  // Start with our first two digits :)
  startWith(...firstTwoFibs),
);

fibonacci$.subscribe(console.log);

// logs
// 0
// 1
// 1
// 2
// 3
// 5
// 8
// 13
// 21
// 34
// 55
```

### 笔记

上面的 `scan` 用法和 `reduce` 的用法很像，当我们把 `scan` 替换为 `reduce` 时就能发现它们之间的区别了

```typescript
import { of, map, reduce } from 'rxjs';

const numbers$ = of(1, 2, 3);

numbers$
  .pipe(
    // Get the sum of the numbers coming in.
    reduce((total, n) => total + n),
    // Get the average by dividing the sum by the total number
    // received so var (which is 1 more than the zero-based index).
    map((sum, index) => sum / (index + 1)),
  )
  .subscribe(console.log);

// logs
// 6
```

斐波那契数列

```typescript
import { interval, map, startWith, reduce } from 'rxjs';

const firstTwoFibs = [0, 1];
// An endless stream of Fibonacci numbers.
const fibonacci$ = interval(1000).pipe(
  // Scan to get the fibonacci numbers (after 0, 1)
  reduce(([a, b]) => [b, a + b], firstTwoFibs),
  // Get the second number in the tuple, it's the one you calculated
  map(([, n]) => n),
  // Start with our first two digits :)
  startWith(...firstTwoFibs),
);

fibonacci$.subscribe(console.log);

// logs
// 0
// 1
```

通过上面的替换可以发现：`reduce` 只会输出结果而不会输出遍历过程，所以其实 `scan` 比起 `reduce` 更像常规使用的 `Array.prototype.reduce`。

## [pluck](https://rxjs.dev/api/operators/pluck)

> 将每个源值映射到其指定的嵌套属性。

> 与 map 类似，但仅用于选择每个发来的值的嵌套属性之一。

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/pluck.png)

根据描述某属性路径的字符串或数字列表，从源 `Observable` 的所有值中检索指定嵌套属性的值。如果无法解析某个属性，它将为该值返回 `undefined`。

### 例子

将每次点击映射为此点击的目标元素的 `tagName`

```typescript
import { fromEvent, pluck } from 'rxjs';

const clicks = fromEvent(document, 'click');
// 获取e.target.tagName
const tagNames = clicks.pipe(pluck('target', 'tagName'));

tagNames.subscribe((x) => console.log(x));
```

### 笔记

根据路径从对象中取值，类似 `lodash` 的 `get` 函数。
