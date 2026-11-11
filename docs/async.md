# Async

```typescript
import { safe, safeAsync, pipe, memo, debounce, throttle, retry, timeout, once, memoAsync, defer, parallel, sequential } from 'duckkit/async'
```

---

## safe

Wraps a synchronous function in a Result type. Returns `{ ok: true, value }` or `{ ok: false, error }`.

```typescript
safe<T>(fn: () => T): Result<T>
```

```typescript
const result = safe(() => JSON.parse(rawString))

if (result.ok) {
  console.log(result.value)            // typed T ✅
} else {
  console.error(result.error.message)  // typed Error ✅
}
```

Non-Error throws are automatically wrapped in an `Error`. The original `Error` instance is preserved when the thrown value is already an `Error`.

```typescript
// null, undefined, false are valid ok values
const result = safe(() => null)
result.ok  // true ✅
```

---

## safeAsync

Same as `safe` but for async functions. Never rejects — always resolves to `Ok<T>` or `Err`.

```typescript
safeAsync<T>(fn: () => Promise<T>): Promise<Result<T>>
```

```typescript
const result = await safeAsync(() => fetch('/api/user').then(r => r.json()))

if (result.ok) renderUser(result.value)
else showError(result.error.message)
```

---

## Result types

```typescript
type Ok<T> = { ok: true; value: T }
type Err   = { ok: false; error: Error }
type Result<T> = Ok<T> | Err
```

Import them directly if you need to type your own functions:

```typescript
import type { Result, Ok, Err } from 'duckkit/async'

function parseConfig(raw: string): Result<Config> {
  return safe(() => JSON.parse(raw))
}
```

---

## pipe

Creates a typed pipeline for chaining transformations. Each `.through()` step is fully typed — no `any`.

```typescript
pipe<T>(value: T): Pipeline<T>
```

```typescript
const result = pipe('  hello world  ')
  .through(s => s.trim())           // string
  .through(s => s.toUpperCase())    // string
  .through(s => s.split(' '))       // string[]
  .through(arr => arr.join('-'))    // string
  .value()
// "HELLO-WORLD"
```

`.value()` extracts the final result. Calling `.value()` without any `.through()` returns the original value unchanged.

> **No async support:** Passing an async function to `.through()` gives `Pipeline<Promise<T>>` — the promise is not awaited, and the rest of the chain operates on the Promise object itself, not the resolved value. TypeScript won't catch this.
>
> ```typescript
> pipe(userId)
>   .through(id => fetchUser(id))   // Pipeline<Promise<User>> ⚠️
>   .through(user => user.name)     // user is Promise<User>, not User ❌
> ```
>
> For async pipelines, use plain `await` chains or `sequential` instead.

---

## memo

Memoizes a function — caches results by arguments. Subsequent calls with the same args return instantly without calling the function again.

```typescript
memo<Args, R>(fn: (...args: Args) => R, options?: { maxSize?: number }): (...args: Args) => R
```

```typescript
const calculate = memo((n: number) => n * n * n)
calculate(5)  // runs — 125
calculate(5)  // cached — 125, fn never called again
calculate(6)  // runs — different arg
```

Uses `JSON.stringify` for cache keying. Falsy return values (`0`, `false`, `null`) are cached correctly. Each memoized instance has its own cache.

Use `maxSize` to cap memory usage. When the limit is reached, the oldest cached entry is evicted (FIFO):

```typescript
const calculate = memo((n: number) => n * n * n, { maxSize: 100 })
// cache never grows beyond 100 entries ✅
```

`maxSize` must be a positive integer. `0`, negative numbers, and floats throw at construction time. Omit the option entirely for an unbounded cache.

For async functions, use `memoAsync` instead.

> **`JSON.stringify` limits the keying:** Calls throw on circular references and `BigInt` args.
>
> ```typescript
> const fn = memo((x: bigint) => x * 2n)
> fn(5n)  // TypeError: Do not know how to serialize a BigInt ❌
>
> const obj: any = {}; obj.self = obj
> memo(g)(obj)  // TypeError: cyclic object value ❌
> ```
>
> If you need these, key the cache yourself with a different key function or use a `Map` directly.

> **`null` and `undefined` args collide:** `JSON.stringify([undefined])` and `JSON.stringify([null])` both produce `'[null]'`, so `fn(undefined)` and `fn(null)` share the same cache key.
>
> ```typescript
> const fn = memo((x: string | null | undefined) => x ?? 'default')
> fn(null)       // runs — cached under '[null]'
> fn(undefined)  // cache hit — returns 'default' even though fn(undefined) was never called ❌
> ```

> **Object key order matters:** `{a: 1, b: 2}` and `{b: 2, a: 1}` are semantically equal but produce different cache keys. The second call will miss the cache where you'd expect a hit.

> **Functions, symbols, and inner `undefined` are dropped:** `JSON.stringify` silently omits these when serializing objects, leading to collisions when the dropped value is the only difference.
>
> ```typescript
> const fn = memo((opt: { cb: () => void }) => ...)
> fn({ cb: A })  // key '{}'
> fn({ cb: B })  // key '{}' — same cache entry, A's result returned ❌
> ```

---

## memoAsync

Like `memo` but for async functions. Caches the promise itself — so concurrent calls with the same args share one request instead of firing duplicates.

```typescript
memoAsync<Args, R>(fn: (...args: Args) => Promise<R>, options?: { maxSize?: number }): (...args: Args) => Promise<R>
```

```typescript
const getUser = memoAsync((id: string) => fetchUser(id))

await getUser('123')  // fetches
await getUser('123')  // from cache — no request made

// concurrent calls share one request
await Promise.all([getUser('123'), getUser('123')])
// fetchUser called only once ✅
```

If the async function rejects, the cache entry is deleted so the next call retries instead of returning a cached rejection.

Use `maxSize` to cap memory usage. Same rules as `memo` — must be a positive integer or omitted.

```typescript
const getUser = memoAsync(fetchUser, { maxSize: 200 })
// safe for long-running apps — cache stays bounded ✅
```

> **Same `JSON.stringify` limits as `memo`** — circular references and BigInt args throw, `null`/`undefined` collide, object key order matters, inner functions/symbols are dropped. See `memo` for details.

---

## debounce

Returns a debounced version of a function. Only fires after the specified delay has passed since the last call.

```typescript
debounce<Args>(fn: (...args: Args) => void, delay: number): Debounced<Args>
// Debounced<Args> = ((...args: Args) => void) & { cancel(): void; flush(): void }
```

```typescript
const onSearch = debounce((query: string) => fetchResults(query), 300)
input.addEventListener('input', e => onSearch(e.target.value))
// user types fast — fetchResults only fires 300ms after they stop
```

Every new call resets the timer. Only the args from the last call are used when it fires.

`cancel()` drops the pending call. `flush()` runs the pending call right now, with the last args, instead of waiting. Both do nothing when no call is pending.

```typescript
const save = debounce(() => saveForm(), 1000)
window.addEventListener('beforeunload', () => save.flush())  // don't lose the last edit
onUnmount(() => save.cancel())                                // or drop it
```

> **Return value is always `void`:** The debounced wrapper can't return the original function's value since execution is deferred. Don't use it to wrap functions whose return value you need synchronously.

> **`this` is not preserved:** The returned wrapper is an arrow function — `this` is captured lexically at the call to `debounce`, not at the call to the wrapper. If you debounce a method that uses `this`, bind it first or wrap manually:
>
> ```typescript
> // wrong — `this` inside doSomething is whatever debounce was called with
> obj.handler = debounce(obj.doSomething, 200)
>
> // right — bind first
> obj.handler = debounce(obj.doSomething.bind(obj), 200)
> ```

---

## throttle

Returns a throttled version of a function that runs at most once per `ms` milliseconds. The first call runs immediately. Calls made while waiting are not lost: the last one runs when the wait ends (the "trailing" call), with the newest arguments.

```typescript
throttle<Args>(fn: (...args: Args) => void, ms: number, options?: { trailing?: boolean }): Throttled<Args>
// Throttled<Args> = ((...args: Args) => void) & { cancel(): void }
```

```typescript
const onScroll = throttle(() => updatePosition(), 100)
window.addEventListener('scroll', onScroll)
// runs immediately, at most once every 100ms, and once more after scrolling stops
```

Unlike `debounce`, throttle runs right away and at a steady rate. Because of the trailing call, the final position after a scroll or resize is always handled.

- `{ trailing: false }` drops calls made while waiting instead of running the last one.
- `cancel()` drops a pending trailing call and resets the timer, so the next call runs immediately.

```typescript
const onResize = throttle(() => recalcLayout(), 200, { trailing: false })
onUnmount(() => onResize.cancel())
```

> **Return value is always `void`:** Same as `debounce` — the throttled wrapper can't return the original function's value.

> **`this` is not preserved:** Same as `debounce` — bind the method first if `this` matters.

---

## retry

Retries an async function up to `times` attempts. Supports optional delay and exponential backoff.

```typescript
retry<T>(fn: () => Promise<T>, times?: number, delayMs?: number, backoff?: boolean): Promise<T>
```

```typescript
// 3 attempts, 1s between each
const data = await retry(() => fetchUser(id), 3, 1000)

// exponential backoff — waits 200ms then 400ms between 3 attempts
await retry(() => fetchData(), 3, 200, true)

// 4 attempts with exponential backoff — waits 200ms, 400ms, 800ms
await retry(() => fetchData(), 4, 200, true)
```

Defaults to 3 attempts with no delay. Stops and returns on first success. Throws the last error if all attempts fail. Non-Error throws are wrapped in `Error`.

`times` must be a positive integer (>= 1). Throws on `0`, negatives, floats, and `NaN`.

> **`fn` is called up to `times` total — not `times` retries:** `times = 3` means 3 attempts (1 original + 2 retries) and 2 delays between them. The doubled delay value computed after the final wait is never used.

> **Only retry idempotent operations:** `retry` has no way to know whether a failed call had side effects. Retrying a non-idempotent operation (e.g. a payment, an email send) may execute it multiple times. Make sure the underlying operation is safe to repeat.

---

## timeout

Races a promise against a timer. Rejects with `TimeoutError` if the timer wins.

```typescript
timeout<T>(promise: Promise<T>, ms: number, message?: string): Promise<T>
```

```typescript
try {
  const data = await timeout(fetchUser(id), 5000)
} catch (e) {
  if (e instanceof TimeoutError) console.log('too slow')
}

// custom error message
await timeout(slowOperation(), 3000, 'Request took too long')
```

The timer is cleaned up properly after the promise resolves or rejects — no memory leaks.

> **The underlying promise keeps running after timeout:** `timeout` races the promise but does not cancel it. If the timer wins, `TimeoutError` is thrown — but the original operation continues in the background until it settles on its own.
>
> ```typescript
> // the fetch request is still in-flight after TimeoutError is thrown ⚠️
> await timeout(fetch('/api/slow'), 1000)
> ```
>
> To actually cancel the operation, pass an `AbortController` signal to it and abort manually in a `catch` block:
>
> ```typescript
> const controller = new AbortController()
> try {
>   await timeout(fetch('/api/slow', { signal: controller.signal }), 1000)
> } catch (e) {
>   if (e instanceof TimeoutError) controller.abort()
>   throw e
> }
> ```

---

## once

Returns a version of a function that only executes on the first call. All subsequent calls return the cached result.

```typescript
once<Args, R>(fn: (...args: Args) => R): (...args: Args) => R
```

```typescript
const init = once(() => setupDatabase())
init()  // runs
init()  // returns cached result, fn never called again

const getConfig = once(() => loadConfigFromDisk())
// no matter how many times called, disk is read once
```

Args are passed on the first call only and ignored on subsequent calls. Each `once` instance has its own state.

> **If the first call throws, subsequent calls return `undefined`:** The `called` flag is set before `fn` executes. If `fn` throws, the error propagates but the function is marked as called — all future calls return `undefined` cast as `R` without calling `fn` again.
>
> ```typescript
> const init = once(() => { throw new Error('failed') })
>
> init()  // throws 'failed' ✅
> init()  // returns undefined silently — typed as R ❌
> ```
>
> If the first call can fail and you want to retry on failure, don't use `once`. Use a manual flag that you only set after success:
>
> ```typescript
> let result: R | undefined
> function getOnce() {
>   if (!result) result = expensiveSetup()
>   return result
> }
> ```

---

## defer

Creates a deferred promise — a promise you can resolve or reject from outside.

```typescript
defer<T>(): Deferred<T>

interface Deferred<T> {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (reason?: unknown) => void
}
```

```typescript
const d = defer<string>()
setTimeout(() => d.resolve('done'), 1000)
const result = await d.promise  // 'done' after 1s

// wait for user action
const confirmation = defer<boolean>()
confirmButton.onclick = () => confirmation.resolve(true)
cancelButton.onclick = () => confirmation.resolve(false)
const confirmed = await confirmation.promise
```

> **Hangs forever if never settled:** If nothing calls `.resolve()` or `.reject()`, `d.promise` never resolves. Any code awaiting it will hang indefinitely — and in Node.js, it can prevent the process from exiting. Always ensure every code path leads to a settle call, or pair with `timeout` if the operation has a deadline.
>
> ```typescript
> const d = defer<string>()
> await timeout(d.promise, 5000)  // at least it won't hang forever ✅
> ```

> **Calling resolve or reject multiple times is a no-op:** Once a promise is settled, further calls to `.resolve()` or `.reject()` are silently ignored — standard Promise behavior.

---

## parallel

Runs async tasks in parallel with an optional concurrency limit.

```typescript
parallel<T>(tasks: (() => Promise<T>)[], options?: { concurrency?: number }): Promise<T[]>
```

```typescript
// all at once
const results = await parallel([fetchA, fetchB, fetchC])

// max 2 at a time — prevents API rate limit hits
const results = await parallel(
  urls.map(url => () => fetch(url)),
  { concurrency: 2 }
)
```

Results are returned in the same order as the tasks, regardless of completion order. Without a concurrency limit, behaves like `Promise.all`.

`concurrency` must be a positive integer (>= 1) when provided. Throws on `0`, negative numbers, and floats. Omit the option entirely for unlimited concurrency.

> **One rejection stops the queue but running tasks continue:** If a task rejects, the error propagates immediately — but any tasks already in-flight finish on their own. Tasks not yet started are never run. Same behavior as `Promise.all`.

---

## sequential

Runs async tasks one after another, in order. Each task waits for the previous one to finish.

```typescript
sequential<T>(tasks: (() => Promise<T>)[]): Promise<T[]>
```

```typescript
const results = await sequential([
  () => createUser(data),
  () => sendWelcomeEmail(data.email),
  () => logSignup(data.id),
])
// runs in order — each step waits for the previous ✅
```

If any task rejects, the remaining tasks are not run and the error propagates.