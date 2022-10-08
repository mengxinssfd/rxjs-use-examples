# [过滤操作符(filtering-operators)](https://rxjs.dev/guide/operators#filtering-operators)

## [take](https://rxjs.dev/api/operators/take)

> 仅发送源 Observable 发出的前 [`count`](https://rxjs.tech/api/index/function/count) 个值。

> ### 返回值
>
> [`take`](https://rxjs.tech/api/index/function/take) 会返回一个 `Observable`，它只发送源 Observable 发出的前 [`count`](https://rxjs.tech/api/index/function/count) 个值。如果源发送的数量少于 [`count`](https://rxjs.tech/api/index/function/count)，则发送它的所有值。之后，无论源是否完成，它都会完成。

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/take.png)

### 例子

取每秒定期重复 Observable 中前 5 秒的值

```typescript
import { interval, take } from 'rxjs';

const intervalCount = interval(1000);
const takeFive = intervalCount.pipe(take(5));
takeFive.subscribe((x) => console.log(x));

// Logs:
// 0
// 1
// 2
// 3
// 4
```

### 笔记

`take`操作符还是很容易理解的，参数填多少个就拿多少个，多了不要

## [takeUntil](https://rxjs.dev/api/index/function/takeUntil)

> 发送源 Observable 发出的值，直到 `notifier` Observable 发出一个值。

> [`takeUntil`](https://rxjs.tech/api/index/function/takeUntil) 会订阅并开始镜像源 Observable。它还会监视你提供的第二个 Observable `notifier`。如果此 `notifier` 发出一个值，则输出 Observable 将停止镜像源 Observable 并完成。如果此 `notifier` 没有发出任何值并直接完成，则 [`takeUntil`](https://rxjs.tech/api/index/function/takeUntil) 将传递所有值。

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/takeUntil.png)

### 例子

每秒滴答一次，直到发生第一次点击

```typescript
import { interval, fromEvent, takeUntil } from 'rxjs';

const source = interval(1000);
const clicks = fromEvent(document, 'click');
const result = source.pipe(takeUntil(clicks));
result.subscribe((x) => console.log(x));
```

### 笔记

跟`take`类似，只不过`takeUntil`的拿的次数不是固定的，而是参数上的`Obesevable`触发才停止`take`

## [takeLast](https://rxjs.dev/api/index/function/takeLast)

> 等待源完成，然后从源发送最后 N 个值，由 [`count`](https://rxjs.tech/api/index/function/count) 参数指定。

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/takeLast.png)

### 例子

```typescript
import { range, takeLast } from 'rxjs';

const many = range(1, 100);
const lastThree = many.pipe(takeLast(3));
lastThree.subscribe((x) => console.log(x));

// outputs
// 98
// 99
// 100
```

### 笔记

从例子中可以看出：`takeLast`是从生成的 1-100 中获取最后 3 个；而且命名也很清晰明了。

不过`takeLast`不能使用异步的`Observable`

```typescript
import { takeLast } from 'rxjs';

const lastThree = interval(100).pipe().pipe(takeLast(3));
lastThree.subscribe(console.log);
```

上面这段代码不会输出任何信息。

当然我们可以改动一下代码，把`interval`提升一下：

```typescript
import { takeLast } from 'rxjs';

const lastThree = of(0)
  .pipe(
    mergeMap(() => {
      return interval(10).pipe(
        take(20),
        map((x) => x),
      );
    }),
  )
  .pipe(takeLast(3));
lastThree.subscribe(console.log);

// outputs
// 17
// 18
// 19
```

使用前面说到的`mergeMap`，把异步的`Observable`提升到外部，这样就可以订阅异步`Observable`了