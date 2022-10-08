# [实用工具操作符(Utility Operators)](https://rxjs.dev/guide/operators#utility-operators)

## [tap](https://rxjs.dev/api/operators/tap)

> 用于对来自源 observable 的通知执行副作用

> *当你想借助某个通知来影响外部状态而不想更改此通知时使用*
>
> [`tap`](https://rxjs.tech/api/index/function/tap) 最常见的用途实际上是用于调试。你可以在 Observable [`pipe`](https://rxjs.tech/api/index/function/pipe) 中的任何位置放置一个 [`tap`](https://rxjs.tech/api/index/function/tap)`(console.log)`，以记录这些通知，因为它们是由以前的操作返回的源发出来的

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/tap.png)

### 例子

在处理之前检查一个随机数。下面是一个 observable，它将使用 0 到 1 之间的随机数，并根据该数字的大小发送 `'big'` 或 `'small'`。但是我们还想记录其原始数字是多少，所以我们添加了一个 [`tap`](https://rxjs.tech/api/index/function/tap)`(console.log)`。

```typescript
import { of, tap, map } from 'rxjs';

of(Math.random())
  .pipe(
    tap(console.log),
    map((n) => (n > 0.5 ? 'big' : 'small')),
  )
  .subscribe(console.log);
```

### 笔记

文档已经写得很清楚了，就是可以执行一些操作而不会改动或影响到原有的`Observable` ，虽然用其他的操作符也可以，不过最好还是不要；那样看起来就像遍历数组使用`map`，`filter`操作一样，虽然也能达到目的，但看起来很不专业，要遍历还是`forEach`更语义化、更干净一点。

与老版本中比如 v4 是`Observable.prototype.do`的功能是一样的

## [delay](https://rxjs.dev/api/operators/delay)

> 将源 Observable 的条目的发送延迟给定的超时时长或等到给定的时间（Date）。

> *将每个条目的发送时间推迟某个指定的毫秒数*

### 弹珠图

![](https://rxjs.tech/assets/images/marble-diagrams/delay.png)

### 例子

#### 把每次点击延迟一秒

```typescript
import { fromEvent, delay } from 'rxjs';

const clicks = fromEvent(document, 'click');
const delayedClicks = clicks.pipe(delay(1000)); // each click emitted after 1 second
delayedClicks.subscribe((x) => console.log(x));
```

#### 延迟所有点击，一直等到未来的某个特定日期为止

```typescript
import { fromEvent, delay } from 'rxjs';

const clicks = fromEvent(document, 'click');
const date = new Date('March 15, 2050 12:00:00'); // in the future
const delayedClicks = clicks.pipe(delay(date)); // click emitted only after that date
delayedClicks.subscribe((x) => console.log(x));
```

### 笔记

这个操作符的文档也很清晰，就是延迟执行。

案例 1 按毫秒延时没什么好说的用就是了，各种项目中很常用。

案例 2 的用处可以用到一些业务中，比如需要到某时才开放的功能，就能用到了；不过一般业务中本地时间是不能信任的，好在`RxJS`也想到了，`delay`函数的第二个参数可以处理每个值的时间偏移，在此就不一一赘述了。