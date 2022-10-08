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
