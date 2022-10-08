# [创建操作符(Creation Operators)](https://rxjs.dev/guide/operators#creation-operators-1)

- [`ajax`](https://rxjs.dev/api/ajax/ajax)
- [`bindCallback`](https://rxjs.dev/api/index/function/bindCallback)
- [`bindNodeCallback`](https://rxjs.dev/api/index/function/bindNodeCallback)
- [`defer`](https://rxjs.dev/api/index/function/defer)
- [`empty`](https://rxjs.dev/api/index/function/empty)
- [`from`](https://rxjs.dev/api/index/function/from)
- [`fromEvent`](https://rxjs.dev/api/index/function/fromEvent)
- [`fromEventPattern`](https://rxjs.dev/api/index/function/fromEventPattern)
- [`generate`](https://rxjs.dev/api/index/function/generate)
- [`interval`](https://rxjs.dev/api/index/function/interval)
- [`of`](https://rxjs.dev/api/index/function/of)
- [`range`](https://rxjs.dev/api/index/function/range)
- [`throwError`](https://rxjs.dev/api/index/function/throwError)
- [`timer`](https://rxjs.dev/api/index/function/timer)
- [`iif`](https://rxjs.dev/api/index/function/iif)

## [from](https://rxjs.dev/api/index/function/from)

> 从 `Array`、`ArrayLike`对象、`Promise`、可迭代对象或 `Observable` 类似对象创建 `Observable`。

> [`from`](https://rxjs.tech/api/index/function/from) 将各种其它对象和数据类型转换为 `Observables`。它还将 `Promise`、数组类似对象或[可迭代](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)对象转换为可发出该 `Promise`、数组或可迭代对象中条目的 `Observable`。在这种情况下，字符串会被视为字符数组。`Observable` 类似对象（包含一个以 `ES2015 Symbol for Observable` 命名的函数）也可以通过这个操作符进行转换。

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/from.png)

### 例子

将数组转换为 Observable

```typescript
import { from } from 'rxjs';

const array = [10, 20, 30];
const result = from(array);

result.subscribe((x) => console.log(x));

// Logs:
// 10
// 20
// 30
```

将无限迭代（从生成器）转换为 Observable

```typescript
import { from, take } from 'rxjs';

function* generateDoubles(seed) {
  let i = seed;
  while (true) {
    yield i;
    i = 2 * i; // double it
  }
}

const iterator = generateDoubles(3);
const result = from(iterator).pipe(take(10));

result.subscribe((x) => console.log(x));

// Logs:
// 3
// 6
// 12
// 24
// 48
// 96
// 192
// 384
// 768
// 1536
```

\~\~使用 [~~`asyncScheduler`~~](https://rxjs.tech/api/index/const/asyncScheduler) \~\~

注意：该方法已弃用，修改方法见[RxJS - Scheduler Argument](https://rxjs.dev/deprecations/scheduler-argument#refactoring-of-of-and-from)

```typescript
import { from, asyncScheduler } from 'rxjs';

console.log('start');

const array = [10, 20, 30];
const result = from(array, asyncScheduler);

result.subscribe((x) => console.log(x));

console.log('end');

// Logs:
// 'start'
// 'end'
// 10
// 20
// 30
```

改动

```diff
import {
-  from,
+  scheduled,
  asyncScheduler,
} from 'rxjs';

console.log('start');

const array = [10, 20, 30];

- const result = from(array, asyncScheduler);
+ const result = scheduled(array, asyncScheduler);

result.subscribe((x) => console.log(x));

console.log('end');

// Logs:
// 'start'
// 'end'
// 10
// 20
// 30
```

使用`promise`

```typescript
import { from } from 'rxjs';

const result = from(
  new Promise<string>((resolve) => {
    setTimeout(resolve, 1000, 'test');
  }),
);

result.subscribe((x) => console.log(x));

// outputs
// test
```

### 笔记

该操作符类似`Array.from`，把一个类数组对象或可迭代对象转成数组序列，并依次发出；或把`Promise`转换为`Observable`。

## [of](https://rxjs.dev/api/index/function/of)

> _每个参数都会成为 `next` 通知。_

> 与 [`from`](https://rxjs.tech/api/index/function/from) 不同，它不进行任何展平，而是将每个参数作为单独的 `next` 通知整体发送

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/of.png)

### 例子

发送值 `10, 20, 30`

```typescript
import { of } from 'rxjs';

of(10, 20, 30).subscribe({
  next: (value) => console.log('next:', value),
  error: (err) => console.log('error:', err),
  complete: () => console.log('the end'),
});

// Outputs
// next: 10
// next: 20
// next: 30
// the end
```

发送数组 `[1, 2, 3]`

```typescript
import { of } from 'rxjs';

of([1, 2, 3]).subscribe({
  next: (value) => console.log('next:', value),
  error: (err) => console.log('error:', err),
  complete: () => console.log('the end'),
});

// Outputs
// next: [1, 2, 3]
// the end
```

### 笔记

`of`与`from`的区别和`call`与`apply`的区别类似，都是接收一系列参数然后挨个输出，只不过`of`接收展开后的数组参数，而`from`接收的是完整的数组参数。

而且`of`不支持`Promise`，或者说不会等待`Promise`完成。

## [range](https://rxjs.dev/api/index/function/range)

> 创建一个可发送指定范围内的数字序列的 Observable。(_发送一个范围内的数字序列。_)

> [`range`](https://rxjs.tech/api/index/function/range) 操作符会按顺序发送一系列连续整数，你可以在其中选择范围的 `start` 及其 `length`。\~\~默认情况下，不使用 \~\~[~~`SchedulerLike`~~](https://rxjs.tech/api/index/interface/SchedulerLike) 并且仅同步传递通知，但可以使用可选的 [~~`SchedulerLike`~~](https://rxjs.tech/api/index/interface/SchedulerLike) 来规范这些传递(已移除，可使用`range(start, count).pipe(observeOn(scheduler)`代替)

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/range.png)

### 例子

产生某个范围内的连续数列

```typescript
import { range } from 'rxjs';

const numbers = range(1, 3);

numbers.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log('Complete!'),
});

// Logs:
// 1
// 2
// 3
// 'Complete!'
```

### 笔记

这个操作符很简单明了了：创建一个从 m 到 n 的序列依次输出。

## [fromEvent](https://rxjs.dev/api/index/function/fromEvent)

> 创建一个 `Observable`，它会发出来自给定事件目标的特定类型的事件。

> _从 DOM 事件或 Node.js EventEmitter 事件或其它事件创建一个 Observable。_

> [`fromEvent`](https://rxjs.tech/api/index/function/fromEvent) 的第一个参数是要从中接收事件的目标，它是一个对象，具有一个能用来注册事件处理器的方法。第二个参数是一个字符串，用来指出我们要监听的事件类型。[`fromEvent`](https://rxjs.tech/api/index/function/fromEvent) 支持一些选定类型的事件目标，稍后将详细介绍。如果你的事件目标与下面列出的任何目标都不匹配，则应该使用可用于任意 API 的 [`fromEventPattern`](https://rxjs.tech/api/index/function/fromEventPattern)。对于 [`fromEvent`](https://rxjs.tech/api/index/function/fromEvent) 支持的 API，它们用于添加和删除事件处理函数的方法有不同的名称，但它们都能接受用于描述事件类型的字符串和一个函数，每当这类事件发生时都会调用该函数。
>
> 每当订阅所生成的 Observable 时，事件处理函数都会注册到给定事件类型的事件目标。当该事件触发时，作为第一个参数传给注册函数的那个值将由输出 Observable 发出。当 Observable 被退订时，该函数将从事件目标中取消注册。
>
> 请注意，如果事件目标调用的是具有多个参数的已注册函数，则第二个和后续参数将不会出现在结果流中。为了访问它们，你可以给 [`fromEvent`](https://rxjs.tech/api/index/function/fromEvent) 传一个可选的投影函数，该函数将使用传给事件处理器的所有参数进行调用。然后，输出 Observable 将发出此投影函数返回的值，而不是通常的值。
>
> 请记住，下面列出的事件目标都是通过鸭子类型进行检查的。这意味着无论你拥有什么样的对象，也无论你在什么环境中工作，只要它公开了如前所述的方法（当然前提是它们的行为也如前所述），你都可以安全地在该对象上使用 [`fromEvent`](https://rxjs.tech/api/index/function/fromEvent)。因此，如果 Node.js 库公开了与 DOM EventTarget 具有相同方法名称的事件目标，[`fromEvent`](https://rxjs.tech/api/index/function/fromEvent) 仍然是一个不错的选择。
>
> 如果你使用的 API 更像回调，而非事件处理器（已订阅的回调函数只会触发一次，因此无需手动取消注册它），你应该改用 [`bindCallback`](https://rxjs.tech/api/index/function/bindCallback) 或 [`bindNodeCallback`](https://rxjs.tech/api/index/function/bindNodeCallback)。
>
> [`fromEvent`](https://rxjs.tech/api/index/function/fromEvent) 支持以下类型的事件目标：
>
> **DOM EventTarget**
>
> 这是一个带有 `addEventListener` 和 `removeEventListener` 方法的对象。
>
> 在浏览器中，`addEventListener` 接受除了事件类型字符串和事件处理函数参数之外的第三个可选参数，它是一个对象或布尔值，都用于额外配置如何以及何时调用传入的函数。当 [`fromEvent`](https://rxjs.tech/api/index/function/fromEvent) 与该类型的事件目标一起使用时，你也可以将此值作为第三个参数来提供。
>
> **Node.js EventEmitter**
>
> 具有 `addListener` 和 `removeListener` 方法的对象。
>
> **jQuery 风格的事件目标**
>
> **JQuery-style event target**
>
> 具有 `on` 和 `off` 方法的对象
>
> **DOM NodeList**
>
> DOM 节点的列表，例如由 `document.querySelectorAll` 或 `Node.childNodes`。
>
> 虽然这个集合本身不是事件目标，但 [`fromEvent`](https://rxjs.tech/api/index/function/fromEvent) 将遍历它包含的所有节点并在每个节点中安装事件处理函数。当返回的 Observable 被退订时，函数将从所有节点中移除。
>
> **DOM HtmlCollection**
>
> 就像 NodeList 一样，它是 DOM 节点的集合。在这里，事件处理函数也会在每个元素中安装和删除。

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/fromEvent.png)

### 例子

发出在 DOM 文档上发生的点击

```typescript
import { fromEvent } from 'rxjs';

const clicks = fromEvent(document, 'click');
clicks.subscribe((x) => console.log(x));

// Results in:
// MouseEvent object logged to console every time a click
// occurs on the document.
```

使用带有捕获选项的 `addEventListener`

```typescript
import { fromEvent } from 'rxjs';

const clicksInDocument = fromEvent(document, 'click', true); // note optional configuration parameter
// which will be passed to addEventListener
const clicksInDiv = fromEvent(someDivInDocument, 'click');

clicksInDocument.subscribe(() => console.log('document'));
clicksInDiv.subscribe(() => console.log('div'));

// By default events bubble UP in DOM tree, so normally
// when we would click on div in document
// "div" would be logged first and then "document".
// Since we specified optional `capture` option, document
// will catch event when it goes DOWN DOM tree, so console
// will log "document" and then "div".
```

### 笔记

该操作符可以绑定`dom`事件，不过除非是写原生`html`不使用框架，否则很少会这样绑定事件。

除此之外绑定拖动事件可以使用它。

## [fromEventPattern](https://rxjs.dev/api/index/function/fromEventPattern)

> 从要注册事件处理器的任意 `API` 创建一个 `Observable`。

> _当要用 [`fromEvent`](https://rxjs.tech/api/index/function/fromEvent) 尚未支持的某个方法添加事件处理器时。_

> [`fromEventPattern`](https://rxjs.tech/api/index/function/fromEventPattern) 允许你将任何支持注册事件处理函数的 API 转换为 Observable。它类似于 [`fromEvent`](https://rxjs.tech/api/index/function/fromEvent)，但更加灵活。事实上，[`fromEvent`](https://rxjs.tech/api/index/function/fromEvent) 的所有用例都可以通过 [`fromEventPattern`](https://rxjs.tech/api/index/function/fromEventPattern) 轻松处理（尽管此方式稍微啰嗦一些）。
>
> 该操作符会接受 `addHandler` 函数作为第一个参数，处理器的参数会传给该函数。该处理器实际上是一个事件处理器函数，你现在可以将其传给想要它的 API。`addHandler` 会在操作符返回的 Observable 被订阅时调用，因此当调用 [`fromEventPattern`](https://rxjs.tech/api/index/function/fromEventPattern) 时不一定会在 API 中注册处理器。
>
> 注册后，每当发生了我们要监听的事件时，[`fromEventPattern`](https://rxjs.tech/api/index/function/fromEventPattern) 返回的 Observable 都会发送事件处理函数收到的参数值。请注意，如果使用多个参数调用事件处理器，则第二个和后续参数将不会出现在 Observable 中。
>
> 如果你使用的 API 也允许取消注册事件处理器，你可以将另一个函数 - `removeHandler` - 作为第二个参数传给 [`fromEventPattern`](https://rxjs.tech/api/index/function/fromEventPattern)。它将注入到与以前相同的处理器函数中，现在你可以用此 API 取消注册它。当结果 Observable 的消费者退订时，就会调用 `removeHandler`。
>
> 在某些 API 中，取消注册的处理方式实际上有所不同。注册事件处理器的方法返回某种标记，该标记稍后用于识别应该取消注册的函数，或者它本身具有取消注册事件处理器的方法。如果你的 API 是这种情况，请确保注册方法返回的令牌会由 `addHandler` 返回。然后它将作为第二个参数传给 `removeHandler`，这样就可以了。
>
> 如果你需要访问所有事件处理器参数（不仅是第一个），或者你需要以任何方式转换它们，你可以使用可选的第三个参数调用 [`fromEventPattern`](https://rxjs.tech/api/index/function/fromEventPattern) - 投影函数，它将接受传给事件处理器的所有参数。从投影函数返回的任何内容都将出现在结果流上，而不是通常的事件处理器的第一个参数。这意味着可以将默认投影函数视为接受其第一个参数并忽略其余参数的函数。

### 参数

| addHandler     | 以`handler` 函数为参数并以某种方式将其附加到实际事件源的函数。 |
| :------------- | :------------------------------------------------------------- |
| removeHandler  | 可选。默认值为`undefined`。                                    |
| resultSelector | 可选。默认值为`undefined`。                                    |

### 返回值

一个 Observable，当事件发生时，它会发送第一个参数传给注册的事件处理器。或者，它会发送当时任何投影函数的返回值

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/fromEventPattern.png)

### 例子

发送在 DOM 文档上发生的点击

```typescript
import { fromEventPattern } from 'rxjs';

function addClickHandler(handler) {
  document.addEventListener('click', handler);
}

function removeClickHandler(handler) {
  document.removeEventListener('click', handler);
}

const clicks = fromEventPattern(addClickHandler, removeClickHandler);
clicks.subscribe((x) => console.log(x));

// Whenever you click anywhere in the browser, DOM MouseEvent
// object will be logged.
```

### 笔记

跟[`fromEvent`](https://rxjs.dev/api/index/function/fromEvent)用法一样，只是`fromEventPattern`传的函数参数是非标准化的事件绑定方式的函数，需要你手动传入自定义的绑定方法和解绑方法。

## [bindCallback](https://rxjs.dev/api/index/function/bindCallback)

> 把回调`API`转化为返回`Observable`的函数。

> 给它一个签名为`f(x, callback)`的函数 f,返回一个函数 g, 调用'g(x)'的时候会返回一个 Observable。

> `bindCallback` 并不是一个操作符，因为它的输入和输出并不是 Observable 。输入的是一个 带有多个参数的函数，并且该函数的最后一个参数必须是个回调函数，当该函数执行完之后会调用回调函数。
>
> `bindCallback` 的输出是一个函数，该函数接受的参数和输入函数一样(除了没有最后一个回调函 数)。当输出函数被调用，会返回一个 Observable 。如果输入函数给回调函数传递一个值，则该 Observable 会发出这个值。如果输入函数给回调函数传递多个值，则该 Observable 会发出一个包含所有值的数组。
>
> 很重要的一点是，输出函数返回的 Observable 被订阅之前，输入函数是不会执行的。这意味着如果输入 函数发起 AJAX 请求，那么该请求在每次订阅返回的 Observable 之后才会发出，而不是之前。
>
> 作为一个可选项，selector 函数可以传给`bindObservable`。该函数接受和回调一样的参数。返回 Observable 发出的值，而不是回调参数本身，即使在默认情况下，传递给回调的多个参数将在流中显示为数组。选择器 函数直接用参数调用，就像回调一样。这意味着你可以想象默认选择器（当没有显示提供的时候）是这样 一个函数:将它的所有参数聚集到数组中，或者仅仅返回第一个参数(当只有一个参数的时候)。
>
> 最后一个可选参数 - [Scheduler](https://cn.rx.js.org/class/es6/Scheduler.js~Scheduler.html) - 当 Observable 被订阅的时候，可以用来控制调用输入函 数以及发出结果的时机。默认订阅 Observable 后调用输入函数是同步的，但是使用`Scheduler.async` 作为最后一个参数将会延迟输入函数的调用，就像是用 0 毫秒的 setTimeout 包装过。所以如果你使用了异 步调度器并且订阅了 Observable ，当前正在执行的所有函数调用，将在调用“输入函数”之前结束。
>
> 当涉及到传递给回调的结果时，默认情况下当输入函数调用回调之后会立马发出，特别是如果回调也是同步调动的话， 那么 Observable 的订阅也会同步调用`next`方法。如果你想延迟调用，使用`Scheduler.async`。 这意味着通过使用`Scheduler.async`，你可以确保输入函数永远异步调用回调函数，从而避免了可怕的 Zalgo。
>
> 需要注意的是，输出函数返回的 Observable 只能发出一次然后完成。即使输入函数多次调用回调函数，第二次 以及之后的调用都不会出现在流中。如果你需要监听多次的调用，你大概需要使用[fromEvent](https://cn.rx.js.org/class/es6/Observable.js~Observable.html#static-method-fromEvent)或者 [fromEventPattern](https://cn.rx.js.org/class/es6/Observable.js~Observable.html#static-method-fromEventPattern)来代替。
>
> 如果输入函数依赖上下文(this)，该上下文将被设置为输出函数在调用时的同一上下文。特别是如果输入函数 被当作是某个对象的方法进行调用，为了保持同样的行为，建议将输出函数的上下文设置为该对象，输入方法不 是已经绑定好的。
>
> 如果输入函数以 node 的方式(第一个参数是可选的错误参数用来标示调用是否成功)调用回调函数，[bindNodeCallback](https://cn.rx.js.org/class/es6/Observable.js~Observable.html#static-method-bindNodeCallback) 提供了方便的错误处理，也许是更好的选择。 `bindCallback` 不会区别对待这些方法，错误参数(是否传递) 被解释成正常的参数。

### 例子

把一个普通函数转为`Observable`

```typescript
import { bindCallback } from 'rxjs';

const boundSomeFunction = bindCallback(
  function someFunction(a: number, b: string, next: (a: number, b: string) => void) {
    console.log('a', a); // 1
    console.log('b', b); // '2'
    console.log('next', next); // function
    next(a, b); // 发布，否则subscribe无法接收到信号
  },
  // (a: number, b: string) => a + b, // 可以把next传的参数加工一下
);
boundSomeFunction(1, '2').subscribe((values) => {
  console.log('values', values); // [1, '2']
});

// outputs

// a 1
// b 2

// next ƒ () {
//   var results = [];
//   for (var _i2 = 0; _i2 < arguments.length; _i2++) {
//     results[_i2] = arguments[_i2];
//   }
//   if (isNodeStyle) {
//   …

// values (2) [1, '2']
```

在对象方法上使用 bindCallback

```typescript
import { bindCallback } from 'rxjs';

const someObject = {
  value: 10,
  methodWithCallback(next: (v: number) => void) {
    console.log('methodWithCallback', this.value);
    next(this.value);
  },
};
const boundMethod = bindCallback(someObject.methodWithCallback);
boundMethod
  .call(someObject) // 确保methodWithCallback可以访问someObject
  .subscribe((v) => {
    console.log('boundMethod', v);
  });

// outputs
// methodWithCallback 10
// boundMethod 10
```

### 笔记

`bindCallback`可以把一个普通函数转为`Observable`，不过仍然需要自己调用，且需要在回调内部调用`next`方法，否则外部不会触发订阅。

如果绑定的是一个对象的方法，需要注意使用`call`或者`apply`，`bind`来绑定回调的`this`指向。

## [bindNodeCallback](https://rxjs.dev/api/index/function/bindNodeCallback)

> 把 Node.js 式回调 API 转换为返回 Observable 的函数。

> 就像是 [bindCallback](https://cn.rx.js.org/class/es6/Observable.js~Observable.html#static-method-bindCallback), 但是回调函数必须形如 `callback(error, result)`这样

> 注意，`bindNodeCallback`同样可以用在非 Node.js 环境中，Node.js 式回调函数仅仅是一种公约，所以 如果你的目标环境是浏览器或者其他，并且你使用的 API 遵守了这种回调公约，`bindNodeCallback`就可以 安全的使用那些 API 函数。
>
> 牢记，传递给回调的错误对象并不是 JavaScript 内置的 Error 的实例。事实上，它甚至可以不是对象。 回调函数的错误参数被解读为“存在”，当该参数有值的时候。它可以是，例如，~~非 0 数字，非空字符串，逻辑 是~~(可能旧版是这样的，新版本\[v7]必须是`null|undefined`才不会触发`error`~~)~~。在所有这些情况下，都会触发 `Observable` 的错误状态。这意味着当使用`bindNodeCallback` 的时候通常形式的回调函数都会触发失败。如果你的 `Observable` 经常发生你预料之外的错误，请检查下 回调函数是否是 node.js 式的回调，如果不是，请使用[bindCallback](https://cn.rx.js.org/class/es6/Observable.js~Observable.html#static-method-bindCallback)替代。

### 例子

从文件系统中读取文件并且从 Observable 中获取数据。

```javascript
const fs = require('fs');
const { bindNodeCallback } = require('rxjs');

const readFileAsObservable = bindNodeCallback(fs.readFile);
const result = readFileAsObservable('./README.md', 'utf8');
result.subscribe(
  (x) => console.log(x),
  (e) => console.error(e),
);
```

绑定一个普通函数

```typescript
import { bindNodeCallback } from 'rxjs';

const boundSomeFunction = bindNodeCallback(
  function someFunction(
    error: string | null | undefined,
    result: string,
    next: (error?: string | null, result?: string) => void,
  ) {
    console.log('someFunction error:', error);
    console.log('someFunction result:', result);
    // console.log('someFunction next', next); // function
    if (error === null || error === undefined) {
      // 触发订阅中的next：第一个参数error必须是null|undefined
      next(undefined, result);
    } else {
      // 否则会触发订阅中的error
      next('error msg');
    }
  },
  // (a: number, b: string) => a + b,
);

boundSomeFunction('test error', '1213').subscribe({
  next(values) {
    console.log('test error values:', values); // 2
  },
  error(...args: any) {
    console.log('test error error:', args);
  },
  complete() {
    console.log('test error complete');
  },
});

console.log('---------------------------------------');

boundSomeFunction(null, 'test result').subscribe({
  next(values) {
    console.log('test result values:', values); // 2
  },
  error(...args: any) {
    console.log('test result error:', args);
  },
  complete() {
    console.log('test result complete');
  },
});

// outputs
// someFunction error: test error
// someFunction result: 1213
// test error error: ['error msg']
// ---------------------------------------
// someFunction error: null
// someFunction result: test result
// test result values: test result
```

### 笔记

`bindNodeCallback`跟`bindCallback`很像，只不过`bindNodeCallback`接收的是`Node.js`回调那种特定格式的回调函数。

而且触发订阅的方法也不一样，需要在调用`next`传参数的时候是否第一个参数是否为`null`或`undefined`才能触发订阅的`next`回调，否则触发订阅的`error`回调。

## [defer](https://rxjs.dev/api/index/function/defer)

> 创建一个 `Observable`。在订阅时会调用 `Observable` 工厂为来每个新的 `Observer` 创建一个 `Observable`。

> _推迟创建 `Observable`，即仅在订阅时创建。_

> [`defer`](https://rxjs.tech/api/index/function/defer) 能让你仅当有 `Observer` 订阅时才创建 `Observable`。它会等待 `Observer` 订阅它，并调用给定的工厂函数来获取 `Observable` —— 工厂函数通常会生成一个新的 `Observable` —— 然后将 `Observer` 订阅到这个 `Observable`。如果工厂函数返回了一个假值，则会改用 `EMPTY` 作为结果 `Observable`。最后，但仍然很重要的一点是，工厂函数调用期间抛出的异常会通过调用 `error` 传递给 `Observer`。

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/defer.png)

### 例子

随机订阅点击事件的 `Observable` 或定时发送的 `Observable`

```typescript
import { defer, fromEvent, interval } from 'rxjs';

const rand = Math.random();
console.log(rand);

const clicksOrInterval = defer(() => {
  return rand > 0.5 ? fromEvent(document, 'click') : interval(1000);
});
clicksOrInterval.subscribe((x) => console.log('result', x));

// Results in the following behavior:
// If the result of Math.random() is greater than 0.5 it will listen
// for clicks anywhere on the "document"; when document is clicked it
// will log a MouseEvent object to the console. If the result is less
// than 0.5 it will emit ascending numbers, one every second(1000ms).
```

以上代码在`rand`大于 0.5 时会使用点击事件触发，否则使用`interval`触发。

使用`Promise`

```typescript
import { defer } from 'rxjs';

defer(() => {
  return new Promise<string>((resolve) => {
    setTimeout(resolve, 1000, 'test');
  });
}).subscribe((value) => {
  console.log('value', value); // value test
});
```

会`await`这个`Promise`。

### 笔记

使用`defer`可以推迟创建 `Observable`，如果参数回调返回的是`Promise`，那么会`await`这个`Promise`，并把结果转换为`Observable`。

## [empty](https://rxjs.dev/api/index/function/empty)

> 创建一个不向 Observer 发出任何条目并立即发出完成通知的 Observable。

> _仅仅发出“完成”，没别的。_

> 这个静态操作符在要创建一个只发出完成通知的简单 Observable 时很有用。它可以用于与其它 Observable 组合，例如在 [`mergeMap`](https://rxjs.tech/api/index/function/mergeMap) 中。

注意 ⚠️

> Replaced with the [`EMPTY`](https://rxjs.dev/api/index/const/EMPTY) constant or [`scheduled`](https://rxjs.dev/api/index/function/scheduled) (e.g. [`scheduled`](https://rxjs.dev/api/index/function/scheduled)`([], scheduler)`). Will be removed in v8.
>
> 使用常量 [`EMPTY`](https://rxjs.dev/api/index/const/EMPTY) 或 [`scheduled`](https://rxjs.dev/api/index/function/scheduled) (e.g. [`scheduled`](https://rxjs.dev/api/index/function/scheduled)`([], scheduler)`)替换`empty`. 将在 v8 版本中移除掉`empty`.

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/empty.png)

### 例子

发出数字 7，然后完成

```typescript
import { empty, startWith } from 'rxjs';

const result = empty().pipe(startWith(7));
result.subscribe((x) => console.log(x));

// Outputs
// 7
```

仅将奇数映射并展平为序列“a”、“b”、“c”

```typescript
import { interval, mergeMap, of, empty } from 'rxjs';

const interval$ = interval(1000);
const result = interval$.pipe(mergeMap((x) => (x % 2 === 1 ? of('a', 'b', 'c') : empty())));
result.subscribe((x) => console.log(x));

// Results in the following to the console:
// x is equal to the count on the interval, e.g. (0, 1, 2, 3, ...)
// x will occur every 1000ms
// if x % 2 is equal to 1, print a, b, c (each on its own)
// if x % 2 is not equal to 1, nothing will be output
```

使用`EMPTY`常量代替

```typescript
import { interval, mergeMap, of, EMPTY } from 'rxjs';

const interval$ = interval(1000);
const result = interval$.pipe(mergeMap((x) => (x % 2 === 1 ? of('a', 'b', 'c') : EMPTY)));
result.subscribe((x) => console.log(x));

// Results in the following to the console:
// x is equal to the count on the interval, e.g. (0, 1, 2, 3, ...)
// x will occur every 1000ms
// if x % 2 is equal to 1, print a, b, c (each on its own)
// if x % 2 is not equal to 1, nothing will be output
```

### 笔记

`empty`或者说`EMPTY`更多的时候说作为一个占位符而存在。

## [generate](https://rxjs.dev/api/index/function/generate)

> [`generate`](https://rxjs.tech/api/index/function/generate) 允许你创建一个由和传统 for 循环非常相似的循环生成的值流。[`generate`](https://rxjs.tech/api/index/function/generate) 的第一个参数是一个初始值。第二个参数是一个接受此值并测试某些条件是否仍然成立的函数。如果是，则循环继续，如果不是，则停止。第三个值是一个函数，它采用先前定义的值并在每次迭代时以某种方式对其进行修改。
>
> 请注意，这三个参数直接等价于传统 for 循环中的三个表达式：第一个表达式初始化某个状态（例如，数字序号），第二个表达式测试循环是否可以执行下一次迭代（例如，如果序号小于 10），第三个说明如何在每一步修改定义的值（例如，序号将增加 1）。
>
> [`generate`](https://rxjs.tech/api/index/function/generate) 操作符的返回值是一个 Observable，它会在每次循环迭代时发送一个值。首先，运行条件函数。如果它返回 true，那么 Observable 会发送当前存储的值（第一次迭代时的初始值），最后使用迭代函数更新该值。如果在某个时候条件返回 false，则 Observable 就会在那一刻完成。
>
> 你可以给 [`generate`](https://rxjs.tech/api/index/function/generate) 传递第四个可选参数 - 结果选择器函数，它允许你立即映射通常由 Observable 发送的值。
>
> 如果你在 [`generate`](https://rxjs.tech/api/index/function/generate) 调用中发现三个匿名函数难以阅读，你可以改为向操作符提供一个对象，该对象具有以下属性： `initialState`、`condition`、`iterate` 和 `resultSelector`，它们应该具有你通常传给 [`generate`](https://rxjs.tech/api/index/function/generate) 的相应值. `resultSelector` 仍然是可选的，但调用 [`generate`](https://rxjs.tech/api/index/function/generate) 的这种形式也允许你省略 `condition`。如果省略它，则意味着条件始终成立，换言之，生成的 Observable 永远不会完成。
>
> 这两种形式的 [`generate`](https://rxjs.tech/api/index/function/generate) 都可以选择接受一个调度器。在多参数调用的情况下，调度器只能作为最后一个参数出现（无论是否有 `resultSelector` 函数）。在单参数调用的情况下，你可以将其作为参数对象的 `scheduler` 属性传给操作符。在这两种情况下，调度器都会决定下一次循环迭代何时发生，也就是下一个值将何时由 Observable 发送。例如，要确保在事件循环中的单独任务上把每个值推送到 Observer，你可以使用 `async` 调度器。请注意，默认情况下（当没有传递调度器时）这些值只会同步发送。

> 不要用独立参数传参，而是使用 options 参数。带有独立参数的签名将在 v8 中被删除。

> 通过运行一个状态驱动的循环来生成 Observable 序列，该循环会产生元素序列，并使用指定的调度器向 Observer 发送消息。此重载接受可能包含初始状态、迭代、条件和调度器的选项对象。

### 例子

使用带有条件和迭代功能的选项对象

```typescript
import { generate } from 'rxjs';

const result = generate({
  initialState: 0,
  condition: (x) => x < 3,
  iterate: (x) => x + 1,
  resultSelector: (x) => x,
});

result.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log('Complete!'),
});

// Logs:
// 0
// 1
// 2
// 'Complete!'
```

使用不带条件函数的选项对象

```typescript
import { generate } from 'rxjs';

const result = generate({
  initialState: 0,
  iterate(value) {
    return value + 1;
  },
  resultSelector(value) {
    return value * 1000;
  },
});

result.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log('Complete!'), // This will never run
});

// Logs:
// 0
// 1000
// 2000
// 3000
// ...and never stops.
```

### 笔记

类似`for`循环和生成器作用比较相似，可以在`rxjs`中代替`for`循环生成或遍历。

注意：不要使用独立的参数而是使用对象参数，不然都不知道参数是什么。

## [interval](https://rxjs.dev/api/index/function/interval)

> 创建一个 Observable，它在指定的 [`SchedulerLike`](https://rxjs.tech/api/index/interface/SchedulerLike) 上按照指定的时间间隔发送连续数列。

> _定期发送增量数字。_
>
> 返回一个每个时间间隔发送一个有序数字的 `Observable`。

> [`interval`](https://rxjs.tech/api/index/function/interval) 会返回一个 Observable，它发送一个无限递增的整数序列，在这些发送之间有一个恒定的时间间隔。首次发送不会立即发出，而是在第一个周期过去后发出。默认情况下，此操作符使用 `async` [`SchedulerLike`](https://rxjs.tech/api/index/interface/SchedulerLike) 来提供时间概念，但你也可以将任何 [`SchedulerLike`](https://rxjs.tech/api/index/interface/SchedulerLike) 传给它。

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/interval.png)

### 例子

发送升序数字，每秒一个（1000 毫秒）直到数字 3

```typescript
import { interval, take } from 'rxjs';

const numbers = interval(1000);

const takeFourNumbers = numbers.pipe(take(4));

takeFourNumbers.subscribe((x) => console.log('Next: ', x));

// Logs:
// Next: 0
// Next: 1
// Next: 2
// Next: 3
```

从 20 开始，并且第一个 0 延迟启动

```typescript
import { interval, take, startWith, map } from 'rxjs';

const numbers = interval(1000);

const takeFourNumbers = numbers.pipe(
  startWith(-1),
  map((x) => x + 21),
  take(4),
);

takeFourNumbers.subscribe((x) => console.log('Next: ', x));

// Logs:
// Next: 20
// Next: 21
// Next: 22
// Next: 23
```

### 笔记

类似`setInterval`，每隔一段设定好的时间发出一个自增的数字；可用`startWith`立即发送，不过不会影响到原来的序列。

## [timer](https://rxjs.dev/api/index/function/timer)

> 创建一个 observable，它将等待指定的时间段或确切的日期，然后发送数字 0。
>
> _用于在延迟后发送通知。_
>
> 此 observable 对于在代码中创建延迟或与其它值作超时竞赛时非常有用。
>
> 默认情况下以毫秒为单位指定 [`delay`](https://rxjs.tech/api/index/function/delay)，但如果提供自定义调度器可能会导致不同的行为。

> 如果传递了第二个参数，它在指定的延迟后开始一个间隔，在单词之后的每个间隔上发送递增的数字 —— 从 `0` 开始。
>
> 默认情况下，[`delay`](https://rxjs.tech/api/index/function/delay) 和 `intervalDuration` 会以毫秒为单位进行指定，但是提供自定义调度器可能会创建不同的行为。

### 例子

等待 3 秒，然后启动另一个 observable

你可能希望使用 [`timer`](https://rxjs.tech/api/index/function/timer) 将订阅 Observable 延迟设定的时间。在这里，我们使用带有 [`concatMapTo`](https://rxjs.tech/api/index/function/concatMapTo) 或 [`concatMap`](https://rxjs.tech/api/index/function/concatMap) 的计时器，以便等待几秒钟再开始订阅源。

```typescript
import { of, timer, concatMap } from 'rxjs';

// This could be any observable
const source = of(1, 2, 3);

timer(3000)
  .pipe(concatMap(() => source))
  .subscribe(console.log);
```

取所有值直到下一分钟开始

使用 `Date` 作为首次发送的触发器，比如你可以等到半夜再触发某个事件，或者等待到下一分钟（如果这么做，本范例就会花太长时间才能运行完）。和 [`takeUntil`](https://rxjs.tech/api/index/function/takeUntil) 配合使用。

```typescript
import { interval, takeUntil, timer } from 'rxjs';

// Build a Date object that marks the
// next minute.
const currentDate = new Date();
const startOfNextMinute = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  currentDate.getDate(),
  currentDate.getHours(),
  currentDate.getMinutes() + 1,
);

// This could be any observable stream
const source = interval(1000);

const result = source.pipe(takeUntil(timer(startOfNextMinute)));

result.subscribe(console.log);
```

**已知限制**

- 会使用 `setTimeout`，它对能调度到多远的未来存在一些限制。

  [`asyncScheduler`](https://rxjs.tech/api/index/const/asyncScheduler)

- 如果所提供的 `scheduler` 会从 `now()` 返回除公元时间之外的时间戳，并且将 `Date` 对象传给 `dueTime` 参数，则首次发送时间的计算将不正确。在这种情况下，最好提前进行自己的计算，并传入一个 `number` 作为 `dueTime`。

**参数**

| due       | 如果是`number`，则为要在发送前等待的时间量（以毫秒为单位）。如果是 `Date`，则为要发送的确切时间。 |
| :-------- | :------------------------------------------------------------------------------------------------ |
| scheduler | 可选。默认值为`undefined`。                                                                       |

**开始一个立即开始的时间间隔**

由于 [`interval`](https://rxjs.tech/api/index/function/interval) 在开始之前会先等待所传入的延迟，因此有时并不理想。你可能想立即开始一个时间间隔。[`timer`](https://rxjs.tech/api/index/function/timer) 就适用于这种场景。在这里，我们将两者并排放置，以便你比较它们。

请注意，这个 observable 永远不会完成。

```typescript
import { timer, interval } from 'rxjs';

timer(0, 1000).subscribe((n) => console.log('timer', n));
interval(1000).subscribe((n) => console.log('interval', n));
```

**已知限制**

- 使用 `setTimeout`，它对能调度到多远的未来存在一些限制。

  [`asyncScheduler`](https://rxjs.tech/api/index/const/asyncScheduler)

- 如果所提供的 `scheduler` 从 `now()` 返回除公元时间之外的时间戳，并且将 `Date` 对象传给 `dueTime` 参数，则首次发送时间的计算将不正确。在这种情况下，最好提前进行自己的计算，并传入一个 `number` 作为 `startDue`。

**参数**

| startDue         | 如果是`number`，则为起始间隔之前等待的时间。如果是 `Date`，则为起始间隔的确切时间。                                           |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| intervalDuration | 间隔中发送的每个值之间存在延迟。在此处传递负数将导致在发送第一个值后立即完成，就好像根本没有传入任何`intervalDuration` 一样。 |
| scheduler        | 可选。默认值为`undefined`。                                                                                                   |

### 笔记

只传一个参数时与`javascript`原生的`api` `setTimeout`相似，`timer`参数还支持时间，可以指定某个具体时间启动，或者 0 延迟立即开始。

传两个参数时与`rxjs`的`interval`相同，在一个参数功能基础上添加每隔一个间隔执行一次的功能，功能比`interval`更加强大。

## [iif](https://rxjs.dev/api/index/function/iif)

> 在订阅时检查布尔值，并从两个可观察源之中选一个

### 参数

| condition   | 决定要选择哪个 Observable 的条件。  |
| :---------- | :---------------------------------- |
| trueResult  | 当条件为真时，将订阅的 Observable。 |
| falseResult | 当条件为假时，将订阅的 Observable。 |

### 返回值

一个代理 `trueResult` 或 `falseResult` 的 Observable，具体取决于 `condition` 函数的结果。

### 说明

[`iif`](https://rxjs.tech/api/index/function/iif) 接受一个返回布尔值的 `condition` 函数和两个返回来源（`trueResult` 和 `falseResult`）的函数，并返回一个 Observable。

在订阅的那一刻，`condition` 函数被调用。如果结果为 `true`，将订阅作为 `trueResult` 传入的源，否则，将订阅作为 `falseResult` 传入的源。

如果你需要检查两个以上的选项，以在多个 observable 之间进行选择，请查看创建方法 [`defer`](https://rxjs.tech/api/index/function/defer)。

### 例子

在运行时更改要订阅哪个 `Observable`

```typescript
import { iif, of } from 'rxjs';

let subscribeToFirst;
const firstOrSecond = iif(() => subscribeToFirst, of('first'), of('second'));

subscribeToFirst = true;
firstOrSecond.subscribe((value) => console.log(value));

// Logs:
// 'first'

subscribeToFirst = false;
firstOrSecond.subscribe((value) => console.log(value));

// Logs:
// 'second'
```

控制对 `Observable` 的访问

```typescript
import { iif, of, EMPTY } from 'rxjs';

let accessGranted;
const observableIfYouHaveAccess = iif(
  () => accessGranted,
  of('It seems you have an access...'),
  EMPTY,
);

accessGranted = true;
observableIfYouHaveAccess.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log('The end'),
});

// Logs:
// 'It seems you have an access...'
// 'The end'

accessGranted = false;
observableIfYouHaveAccess.subscribe({
  next: (value) => console.log(value),
  complete: () => console.log('The end'),
});

// Logs:
// 'The end'
```

### 笔记

`iif`其实就是`if`，根据条件返回`trueResult`或者`falseResult`的`Observable`。

## [throwError](https://rxjs.dev/api/index/function/throwError)

> 创建一个 observable，它将创建一个错误实例，并在订阅后立即将其作为错误推送给消费者。

> _只是报错，什么都不做_

> 这个创建函数对于创建一个 observable 很有用，它会在每次订阅时创建一个错误并报错。通常，在大多数操作符中，当你可能要返回错误的 Observable 时，这是没必要的。在大多数情况下，例如在 [`concatMap`](https://rxjs.tech/api/index/function/concatMap)、[`mergeMap`](https://rxjs.tech/api/index/function/mergeMap)、[`defer`](https://rxjs.tech/api/index/function/defer) 和许多其它的内部返回中，你可以简单地抛出错误，RxJS 会捕获它并把这个错误通知消费者。

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/throw.png)

### 例子

创建一个简单的 Observable，它将创建一个带有时间戳的新错误，并在你每次订阅它时记录它和错误信息

```typescript
import { throwError } from 'rxjs';

let errorCount = 0;

const errorWithTimestamp$ = throwError(() => {
  const error: any = new Error(`This is error number ${++errorCount}`);
  error.timestamp = Date.now();
  return error;
});

errorWithTimestamp$.subscribe({
  error: (err) => console.log(err.timestamp, err.message),
});

errorWithTimestamp$.subscribe({
  error: (err) => console.log(err.timestamp, err.message),
});

// Logs the timestamp and a new error message for each subscription
```

**非必要的使用**

在操作符或带有回调的创建函数中使用 [`throwError`](https://rxjs.tech/api/index/function/throwError) 通常不是必需的

```typescript
import { of, concatMap, timer, throwError } from 'rxjs';

const delays$ = of(1000, 2000, Infinity, 3000);

delays$
  .pipe(
    concatMap((ms) => {
      if (ms < 10000) {
        return timer(ms);
      } else {
        // This is probably overkill.
        return throwError(() => new Error(`Invalid time ${ms}`));
      }
    }),
  )
  .subscribe({
    next: console.log,
    error: console.error,
  });
```

你可以改为抛出错误

```typescript
import { of, concatMap, timer } from 'rxjs';

const delays$ = of(1000, 2000, Infinity, 3000);

delays$
  .pipe(
    concatMap((ms) => {
      if (ms < 10000) {
        return timer(ms);
      } else {
        // Cleaner and easier to read for most folks.
        throw new Error(`Invalid time ${ms}`);
      }
    }),
  )
  .subscribe({
    next: console.log,
    error: console.error,
  });
```

### 笔记

用于抛出错误，不过官方似乎也不怎么推荐使用，还是用原生的`throw new Error('error msg')`清晰明了。
