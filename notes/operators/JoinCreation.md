# [联结创建操作符(Join Creation Operators)](https://rxjs.dev/guide/operators#join-creation-operators)

这些是 Observable 的创建操作符，它们也具有联结功能 —— 发出多个源 Observable 的值。

- [`combineLatest`](https://rxjs.dev/api/index/function/combineLatest)

- [`concat`](https://rxjs.dev/api/index/function/concat)

- [`forkJoin`](https://rxjs.dev/api/index/function/forkJoin)

- [`merge`](https://rxjs.dev/api/index/function/merge)

- [`partition`](https://rxjs.dev/api/index/function/partition)

- [`race`](https://rxjs.dev/api/index/function/race)

- [`zip`](https://rxjs.dev/api/index/function/zip)

## [combineLatest](https://rxjs.dev/api/index/function/combineLatest)

> 组合多个 Observable 以创建一个 Observable，其值是根据其每个输入 Observable 的最新值计算得出的。

> 每当任何输入 Observable 发出一个值时，它都会使用来自所有输入的最新值某一个公式进行求值，然后发出该公式的输出。

> [`combineLatest`](https://rxjs.tech/api/index/function/combineLatest) 会组合来自 observables 数组中传递的所有 Observables 的值。这是通过按顺序订阅每个 Observable 来完成的，并且每当有任何 Observable 发出时，都会从每个 Observable 中收集一个包含最新值的数组。因此，如果你将 `n` 个 Observables 传递给此操作符，则返回的 Observable 将始终发出一个包含 `n` 个值的数组，其顺序与传递的 Observables 的顺序相对应（第一个 Observable 的值将位于数组的序号 0 处，因此在）。
>
> [`combineLatest`](https://rxjs.tech/api/index/function/combineLatest) 的静态版本接受一个 Observables 数组。请注意，如果你事先不知道要组合多少个 Observable，那么用 Observable 数组是一个不错的选择。传递一个空数组将导致 Observable 立即完成。
>
> 为了确保输出数组始终具有相同的长度，[`combineLatest`](https://rxjs.tech/api/index/function/combineLatest) 实际上会等待所有输入 Observable 至少发出一次，然后才开始发出结果。这意味着如果某些 Observable 在其它 Observable 开始发出之前已经发出了值，那么除了最后一个值之外的所有值都会丢失。另一方面，如果某个 Observable 没有发出值但完成了，则结果 Observable 将在同一时刻完成而不发出任何内容，因为现在已不可能再将完成的 Observable 中的值包含在结果数组中。此外，如果某些输入 Observable 没有发出任何值并且永远不会完成，[`combineLatest`](https://rxjs.tech/api/index/function/combineLatest) 也将永远不会发出值并且永远不会完成，因为它会一直次等待所有流发出一些值。
>
> 如果至少一个 Observable 被传递给 [`combineLatest`](https://rxjs.tech/api/index/function/combineLatest) 并且所有传递的 Observables 都发出了一些东西，那么当所有组合流都已完成时，生成的 Observable 将完成。因此，即使某些 Observable 完成，[`combineLatest`](https://rxjs.tech/api/index/function/combineLatest) 的结果仍然会在其它 Observable 完成时发出值。如果是一个已完成的 Observable，从现在开始，它的值将永远是最后一个发出的值。另一方面，如果有任何 Observable 报错，[`combineLatest`](https://rxjs.tech/api/index/function/combineLatest) 也会立即报错，并且所有其它 Observable 都将被退订。

### 例子

组合两个计时器 Observables

```typescript
import { timer, combineLatest } from 'rxjs';

const firstTimer = timer(0, 1000); // emit 0, 1, 2... after every second, starting from now
const secondTimer = timer(500, 1000); // emit 0, 1, 2... after every second, starting 0,5s from now
const combinedTimers = combineLatest([firstTimer, secondTimer]);
combinedTimers.subscribe((value) => console.log(value));
// Logs
// [0, 0] after 0.5s
// [1, 0] after 1s
// [1, 1] after 1.5s
// [2, 1] after 2s
```

上面代码每个`timer`发送都会触发订阅。

~~组合 Observables 的字典~~（该方式将在 v8 弃用，推荐用数组的方式）

```typescript
import { of, delay, startWith, combineLatest } from 'rxjs';

const observables = {
  a: of(1).pipe(delay(1000), startWith(0)),
  b: of(5).pipe(delay(5000), startWith(0)),
  c: of(10).pipe(delay(10000), startWith(0)),
};
const combined = combineLatest(observables);
combined.subscribe((value) => console.log(value));
// Logs
// { a: 0, b: 0, c: 0 } immediately
// { a: 1, b: 0, c: 0 } after 1s
// { a: 1, b: 5, c: 0 } after 5s
// { a: 1, b: 5, c: 10 } after 10s
```

组合 Observables 数组

```typescript
import { of, delay, startWith, combineLatest } from 'rxjs';

const observables = [1, 5, 10].map((n) =>
  of(n).pipe(
    delay(n * 1000), // emit 0 and then emit n after n seconds
    startWith(0),
  ),
);
const combined = combineLatest(observables);
combined.subscribe((value) => console.log(value));
// Logs
// [0, 0, 0] immediately
// [1, 0, 0] after 1s
// [1, 5, 0] after 5s
// [1, 5, 10] after 10s
```

如果是一个已完成的 Observable，从现在开始，它的值将永远是最后一个发出的值。weight 永远固定在最后一个 75.

```typescript
import { of, combineLatest } from 'rxjs';

const weight = of(70, 72, 76, 79, 75);
const height = of(1.76, 1.77, 1.78);
const bmi = combineLatest([weight, height]);
bmi.subscribe((x) => console.log('BMI is ' + x));

// With output to console:
// BMI is 75,1.76
// BMI is 75,1.77
// BMI is 75,1.78
```

```typescript
import { of, combineLatest } from 'rxjs';

const a = of(70, 72, 76, 79, 75);
const b = of(1.76, 1.77, 1.78);
const c = of(1, 2, 3);
const bmi = combineLatest([a, b, c]);
bmi.subscribe((x) => console.log('BMI is ' + x));

// With output to console:
// BMI is 75,1.78,1
// BMI is 75,1.78,2
// BMI is 75,1.78,3
```

### 笔记

规律：

- 必须等每一个`Observable`都触发过后才会触发外部订阅，同一个`Observable`会顶替掉之前的值，并缓存当前值

- 如果前面的`Observable`是一个已完成的`Observable`（非异步的都是已完成的），那么它的值将永远是最后一个发出的值

- 如果每一个`Observable`都发送过值，那么后面每个`Observable`发送值都会触发外部订阅，其他值是`Observable`缓存的至今最后一个发送的值

## [concat](https://rxjs.dev/api/index/function/concat)

> 创建一个输出 Observable，它在当前 Observable 之后顺序地发出每个给定的输入 Observable 中的所有值。

> 通过顺序地发出多个 Observables 的值将它们连接起来，一个接一个的。

> 通过依次订阅输入 Observable 将输出 Observable 加入多个输入 Observable，从源头开始， 合并它们的值给输出 Observable. 只有前一个 Observable 结束才会进行下一个 Observable。

### 弹珠图

![](https://cn.rx.js.org/img/concat.png)

### 例子

将从 0 数到 3 的定时器和从 1 到 10 的同步序列进行连接

```typescript
import { interval, range, take, concat } from 'rxjs';

const timer = interval(1000).pipe(take(4));
const sequence = range(1, 10);
const result = concat(timer, sequence);
result.subscribe((x) => console.log(x));

// outputs 先依次间隔1秒发出0、1、2、3，然后同时依次发出后面的1-10
// 0
// 1
// 2
// 3
// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
// 10
```

连接 3 个 Observables

```typescript
import { interval, take, concat } from 'rxjs';

const timer1 = interval(1000).pipe(take(10));
const timer2 = interval(2000).pipe(take(6));
const timer3 = interval(500).pipe(take(10));
const result = concat(timer1, timer2, timer3);
result.subscribe((x) => console.log(x));
```

### 笔记

与`Array.prototype.concat`一样的功能，可以把多个`Observable`拼接成一个。

多个异步`Observable`拼接可以很方便的实现各步骤不同时间间隔。

## [forkJoin](https://rxjs.dev/api/index/function/forkJoin)

接受一个 [`ObservableInput`](https://rxjs.tech/api/index/type-alias/ObservableInput) 的 `Array` 或 [`ObservableInput`](https://rxjs.tech/api/index/type-alias/ObservableInput) 的字典 `Object`，并返回一个 [`Observable`](https://rxjs.tech/api/index/class/Observable)，它用与传入的数组完全相同的顺序发出一个值数组，或者用与传入的字典相同的构型。

> _等待这些 Observables 完成，然后把它们发出的最后一个值组合起来；如果传递了一个空数组，则立即完成。_

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/forkJoin.png)

[`forkJoin`](https://rxjs.tech/api/index/function/forkJoin) 是一个操作符，它接受任意数量的输入 observable，这些输入 observable 可以作为数组或输入 observable 的字典传递。如果没有提供输入 observables（例如传递一个空数组），那么结果流将立即完成。

[`forkJoin`](https://rxjs.tech/api/index/function/forkJoin) 将等待所有传入的 observables 发出并完成，然后它会发出一个数组或一个对象，其中包含来自相应 observables 的最后一个值。

如果你将一个包含 `n` 个 observable 的数组传给本操作符，那么结果数组将有 `n` 个值，其第一个值是第一个 observable 发出的最后一个值，第二个值是第二个 observable 发出的最后一个值，依此类推。

如果你将 Observable 的字典传递给操作符，则生成的对象将具有与传递的字典相同的键名，它们发出的最后一个值位于相应的键名处。

这意味着 [`forkJoin`](https://rxjs.tech/api/index/function/forkJoin) 不会发出超过一个值，并且会在此之后完成。如果你不仅需要在传入的 Observable 的生命周期结束时发出组合值，而且还需要在整个生命周期中发出组合值，请尝试使用 [`combineLatest`](https://rxjs.tech/api/index/function/combineLatest) 或 [`zip`](https://rxjs.tech/api/index/function/zip) 。

为了使结果数组的长度与输入的 observables 的数量相同，只要任何给定的 observables 完成而没有发出任何值，[`forkJoin`](https://rxjs.tech/api/index/function/forkJoin) 也会在那个时刻完成并且它也不会发出任何值，即使它已经具有来自其它 Observable 的一些最后值。相反，如果有一个 observable 永远不会完成，[`forkJoin`](https://rxjs.tech/api/index/function/forkJoin) 也永远不会完成，除非其它 observable 在某个时刻都完成而不发出值，这会让我们回到前面的情况。总而言之，为了让 [`forkJoin`](https://rxjs.tech/api/index/function/forkJoin) 发出一个值，所有给定的 observables 都必须至少发出一次并完成。

如果在某个时候任何给定的 observable 出错，则 [`forkJoin`](https://rxjs.tech/api/index/function/forkJoin) 也会出错并立即退订其它 observables。

[`forkJoin`](https://rxjs.tech/api/index/function/forkJoin) 会接受一个可选的 `resultSelector` 函数为参数，该函数将使用要发出的数组中的值为参数进行调用。无论 `resultSelector` 返回什么，都会出现在输出 observable 中。这意味着默认的 `resultSelector` 可以被认为是一个函数，它接受它的所有参数并将它们放入一个数组中。请注意，只有当 [`forkJoin`](https://rxjs.tech/api/index/function/forkJoin) 应该发出结果时才会调用 `resultSelector`。

### 例子

~~将 ~~[~~`forkJoin`~~](https://rxjs.tech/api/index/function/forkJoin)~~ 与可观察输入的字典一起使用~~(不推荐使用，将在 v8 中移除)

```typescript
import { forkJoin, of, timer } from 'rxjs';

const observable = forkJoin({
  foo: of(1, 2, 3, 4),
  bar: Promise.resolve(8),
  baz: timer(4000),
});
observable.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log('This is how it ends!'),
});

// Logs:
// { foo: 4, bar: 8, baz: 0 } after 4 seconds
// 'This is how it ends!' immediately after
```

将 [`forkJoin`](https://rxjs.tech/api/index/function/forkJoin) 与可观察输入的数组一起使用

```typescript
import { forkJoin, of, timer } from 'rxjs';

const observable = forkJoin([of(1, 2, 3, 4), Promise.resolve(8), timer(4000)]);
observable.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log('This is how it ends!'),
});

// Logs:
// [4, 8, 0] after 4 seconds
// 'This is how it ends!' immediately after
```

### 笔记

功能类似`Promise.prototype.all`，都是等待所有的 item 完成后才把结果按原数组顺序输出。

跟 [`combineLatest`](https://rxjs.tech/api/index/function/combineLatest) 区别：[`combineLatest`](https://rxjs.tech/api/index/function/combineLatest) 在满足所有都发送过一次的条件后会发送每个间隔后的所有值，是连续性的；`forkJoin`只会发送最后的值。

## [merge](https://rxjs.dev/api/index/function/merge)

创建一个输出 Observable，它会同时从每个给定的输入 Observable 中发送所有值。

> _通过将多个 Observable 的值混合到一个 Observable 中来将多个 Observable 扁平化。_

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/merge.png)

[`merge`](https://rxjs.tech/api/index/function/merge) 订阅每个给定的输入 Observable（作为参数传入），并简单地将所有输入 Observable 中的所有值转发（不做任何转换）到输出 Observable。只有在所有输入 Observable 都完成后，输出 Observable 才会完成。输入 Observable 传递的任何错误都会立即在输出 Observable 上发送。

### 例子

将两个 Observable 合并在一起：“一秒定时”和“点击”

```typescript
import { merge, fromEvent, interval } from 'rxjs';

const clicks = fromEvent(document, 'click');
const timer = interval(1000);
const clicksOrTimer = merge(clicks, timer);
clicksOrTimer.subscribe((x) => console.log(x));

// Results in the following:
// timer will emit ascending values, one every second(1000ms) to console
// clicks logs MouseEvents to console everytime the "document" is clicked
// Since the two streams are merged you see these happening
// as they occur.

// 结果如下：
// 计时器将发出递增值，每秒（1000 毫秒）一个到控制台
// 每次单击都打印 MouseEvents 到控制台
```

合并 3 个 Observable，但同时运行 2 个

```typescript
import { interval, take, merge, map } from 'rxjs';

const timer1 = interval(1000).pipe(
  take(10),
  map((x) => [1, x]),
);
const timer2 = interval(2000).pipe(
  take(6),
  map((x) => [2, x]),
);
const timer3 = interval(500).pipe(
  take(10),
  map((x) => [3, x]),
);

// 控制可以同时运行的Observable数量
const concurrent = 2; // the argument
const merged = merge(timer1, timer2, timer3, concurrent);
merged.subscribe((x) => console.log(x));

// Results in the following:
// - First timer1 and timer2 will run concurrently
// - timer1 will emit a value every 1000ms for 10 iterations
// - timer2 will emit a value every 2000ms for 6 iterations
// - after timer1 hits its max iteration, timer2 will
//   continue, and timer3 will start to run concurrently with timer2
// - when timer2 hits its max iteration it terminates, and
//   timer3 will continue to emit a value every 500ms until it is complete
```

顺序发出

```typescript
import { merge, range } from 'rxjs';

const timer1 = range(1, 10);
const timer2 = range(11, 10);
const timer3 = range(21, 10);

// 控制可以同时运行的Observable数量
// 同步的Observable concurrent无效
const concurrent = 3;
const merged = merge(timer1, timer2, timer3, concurrent);
merged.subscribe((x) => console.log(x));

// logs
// 1
// ...
// 30
```

### 笔记

与`concat`类似，都是把多个`Observable`合成一个，不过有几点不同：

- `merge`的合并后的`Observable`的序列不一定是`merge`参数的顺序，顺序是实际运行时确定的；

- `merge`最后一个参数是数字时，可以设置同步执行`Observable`的数量

  - 设置同步数量后，剩余`Observable`必须等前面的所有同步`Observable`执行完毕后才会执行

  - 如果最后一个数字是 1，那么和`concat`一样，是按照参数顺序执行的

  - 非异步`Observable`最后一个参数是数字时无效

  - 省略同步数量参数时，默认同步数量为参数数量之和
