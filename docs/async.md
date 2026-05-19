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
memo<Args, R>(fn: (...args: Args) => R): (...args: Args) => R
```

```typescript
const calculate = memo((n: number) => n * n * n)
calculate(5)  // runs — 125
calculate(5)  // cached — 125, fn never called again
calculate(6)  // runs — different arg
```

Uses `JSON.stringify` for cache keying. Falsy return values (`0`, `false`, `null`) are cached correctly. Each memoized instance has its own cache.

For async functions, use `memoAsync` instead.

> **`null` and `undefined` args collide:** `JSON.stringify([undefined])` and `JSON.stringify([null])` both produce `'[null]'`, so `fn(undefined)` and `fn(null)` share the same cache key.
>
> ```typescript
> const fn = memo((x: string | null | undefined) => x ?? 'default')
> fn(null)       // runs — cached under '[null]'
> fn(undefined)  // cache hit — returns 'default' even though fn(undefined) was never called ❌
> ```
>
> Avoid `null` and `undefined` as args if they need to produce different results.

> **Cache grows unbounded:** There is no max size or expiry. For functions called with many unique args over a long runtime, memory usage grows indefinitely. If that's a concern, implement your own cache with a size limit and pass it in, or clear the memoized instance periodically by recreating it.

---

## memoAsync

Like `memo` but for async functions. Caches the promise itself — so concurrent calls with the same args share one request instead of firing duplicates.

```typescript
memoAsync<Args, R>(fn: (...args: Args) => Promise<R>): (...args: Args) => Promise<R>
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

> **Same `null`/`undefined` collision and unbounded cache as `memo`** — see notes above.

---

## debounce

Returns a debounced version of a function. Only fires after the specified delay has passed since the last call.

```typescript
debounce<Args>(fn: (...args: Args) => void, delay: number): (...args: Args) => void
```

```typescript
const onSearch = debounce((query: string) => fetchResults(query), 300)
input.addEventListener('input', e => onSearch(e.target.value))
// user types fast — fetchResults only fires 300ms after they stop
```

Every new call resets the timer. Only the args from the last call are used when it fires.

> **Return value is always `void`:** The debounced wrapper can't return the original function's value since execution is deferred. Don't use it to wrap functions whose return value you need synchronously.

> **No cancel or flush:** There is no `.cancel()` to clear a pending call or `.flush()` to fire it immediately. If you need either, implement them on top or use a library like lodash that includes them.

---

## throttle

Returns a throttled version of a function. Fires immediately on the first call, then ignores calls until the interval passes.

```typescript
throttle<Args>(fn: (...args: Args) => void, ms: number): (...args: Args) => void
```

```typescript
const onScroll = throttle(() => updatePosition(), 100)
window.addEventListener('scroll', onScroll)
// fires immediately, then at most once every 100ms
```

Unlike `debounce`, throttle guarantees the function fires right away and at a steady rate.

> **Trailing call is dropped:** If the last call in a burst falls within the throttle interval, it is silently discarded — it never fires. There is no trailing execution. If the final call matters (e.g. a form autosave on the last keystroke), use `debounce` instead.

> **Return value is always `void`:** Same as `debounce` — the throttled wrapper can't return the original function's value.

---

## retry

Retries an async function up to `times` attempts. Supports optional delay and exponential backoff.

```typescript
retry<T>(fn: () => Promise<T>, times?: number, delayMs?: number, backoff?: boolean): Promise<T>
```

```typescript
// 3 attempts, 1s between each
const data = await retry(() => fetchUser(id), 3, 1000)

// exponential backoff — 200ms, 400ms, 800ms
await retry(() => fetchData(), 3, 200, true)
```

Defaults to 3 attempts with no delay. Stops and returns on first success. Throws the last error if all attempts fail. Non-Error throws are wrapped in `Error`.

> **`fn` is called up to `times` total — not `times` retries:** `times = 3` means 3 attempts (1 original + 2 retries), not 3 retries on top of the original call.

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

> **One rejection stops the queue but running tasks continue:** If a task rejects, the error propagates immediately — but any tasks already in-flight finish on their own. Tasks not yet started are never run. Same behavior as `Promise.all`.

> **`concurrency` must be a positive integer:** `concurrency: 0` is treated as no limit (falls back to `Promise.all`). Negative values produce no workers and all tasks are skipped, returning an array of `undefined`. Always pass a value `>= 1` when using the concurrency option.

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