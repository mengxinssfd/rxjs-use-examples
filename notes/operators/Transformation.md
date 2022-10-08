# [转换操作符(Transformation Operators)](https://rxjs.dev/guide/operators#transformation-operators)

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
>> *它类似于 [`filter`](https://rxjs.tech/api/operators/filter)，但会返回两个 Observable：一个类似于 [`filter`](https://rxjs.tech/api/operators/filter) 的输出，另一个则具有不满足条件的值。*
>>

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

> *将每个值映射到一个 Observable，然后展平所有这些内部 Observable。*

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

> *将每个值映射到一个 Observable，然后使用 [`mergeAll`](https://rxjs.tech/api/index/function/mergeAll) 展平所有这些内部 Observable。*

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
| :--------------------------- | :------------- | :--------------- |
| 是否等待 interval 一起启动 | 是           | 否             |
| 遍历结束后循环方式         | 重新开始遍历 | 只保留最后一位 |