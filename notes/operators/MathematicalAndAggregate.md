# [数学和聚合操作符(mathematical-and-aggregate-operators)](https://rxjs.dev/guide/operators#mathematical-and-aggregate-operators)

数学和聚合操作符总共有以下 4 个：

* [`count`](https://rxjs.dev/api/operators/count)
* [`max`](https://rxjs.dev/api/operators/max)
* [`min`](https://rxjs.dev/api/operators/min)
* [`reduce`](https://rxjs.dev/api/operators/reduce)

其中`reduce`用法与数组方法用法一致，`min`和`max`的用法一致，所以只写下`count`与`max`的用法。

## [count](https://rxjs.dev/api/operators/count)

> 对源上发送过的值进行计数，并在源完成时发送该数量。

> [`count`](https://rxjs.tech/api/index/function/count) 会将发送值的 Observable 转换为发送单个值的 Observable，该值表示源 Observable 发送过的值的数量。如果源 Observable 因错误而终止，[`count`](https://rxjs.tech/api/index/function/count) 将传递此错误通知，而不首先发送值。如果源 Observable 根本没有终止，则 [`count`](https://rxjs.tech/api/index/function/count) 既不会发送值也不会终止。此操作符将可选的 `predicate` 函数作为参数，在这种情况下，输出发送的是 `predicate` 的结果为 `true` 的源值的数量。

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/count.png)

### 例子

计算在首次点击之前经过了多少秒

```typescript
import { interval, fromEvent, takeUntil, count } from 'rxjs';

const seconds = interval(1000);
const clicks = fromEvent(document, 'click');
const secondsBeforeClick = seconds.pipe(takeUntil(clicks));
const result = secondsBeforeClick.pipe(count());
result.subscribe((x) => console.log(x));
```

计算 1 到 7 之间有多少个奇数

```typescript
import { range, count } from 'rxjs';

const numbers = range(1, 7);
const result = numbers.pipe(count((i) => i % 2 === 1));
result.subscribe((x) => console.log(x));
// Results in:
// 4
```

### 笔记

符合条件(省略`count`参数或回调函数返回`true`)则计数加 1。

类似`reduce`的用法，用`reduce`也能作为`count`下位替代，不过`count`更加方便也更加语义化。

## [`max`](https://rxjs.dev/api/operators/max)

> [`max`](https://rxjs.tech/api/index/function/max) 操作符会对发送数字（或可用所提供的函数进行比较的条目）的 Observable 进行操作，当源 Observable 完成时，它会发送单个条目：具有最大值的条目

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/max.png)

### 例子

获取一系列数字的最大值

```typescript
import { of, max } from 'rxjs';

of(5, 4, 7, 2, 8)
  .pipe(max())
  .subscribe((x) => console.log(x));

// Outputs
// 8
```

使用比较器函数获取最大条目

```typescript
import { of, max } from 'rxjs';

of({ age: 7, name: 'Foo' }, { age: 5, name: 'Bar' }, { age: 9, name: 'Beer' })
  .pipe(max((a, b) => (a.age < b.age ? -1 : 1)))
  .subscribe((x) => console.log(x.name));

// Outputs
// 'Beer'
```

### 笔记

在数组中查找出最大的一项；该操作符可以传入回调函数依据对象属性查找对象。

类似`Math.max`与`Math.prototype.sort`的结合体：`Math.max`的功能，`Math.prototype.sort`的使用方法。