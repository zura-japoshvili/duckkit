# Delay

```typescript
import { delay, delaySkippable, delayWithAbort, repeat } from 'duckkit/delay'
```

---

## delay

Pauses async execution for a given number of milliseconds.

```typescript
delay(ms: number): Promise<void>
```

```typescript
await delay(1000)  // waits 1 second

console.log('start')
await delay(500)
console.log('500ms later')
```

`delay(0)` resolves on the next tick.

> **Negative `ms` is treated as `0`:** `setTimeout` clamps negative values to 0, so `delay(-500)` resolves on the next tick with no error thrown.

---

## delaySkippable

Waits up to `ms` milliseconds but resolves early if a condition becomes true. Polls the condition at a configurable interval.

```typescript
delaySkippable(ms: number, condition: () => boolean, pollInterval?: number): Promise<void>
```

```typescript
let skip = false
button.onclick = () => { skip = true }

await delaySkippable(3000, () => skip)
// resolves after 3s, or immediately when skip = true
```

If the condition is already `true` when called, resolves immediately without waiting.

```typescript
// custom poll interval — checks every 200ms instead of default 50ms
await delaySkippable(5000, () => userSkipped, 200)
```

The poll interval controls how quickly the skip is detected. Lower = more responsive, higher = less CPU. Default is 50ms.

> **`pollInterval` must be less than `ms`:** If `pollInterval` is larger than `ms`, the timeout fires before the interval ever runs — the skip condition can never trigger.
>
> ```typescript
> await delaySkippable(100, () => skip, 5000)
> // interval never fires — skip has no effect ⚠️
> ```
>
> As a rule, keep `pollInterval` well below `ms`. The default of 50ms is safe for most cases.

> **Errors in `condition()` cause the promise to hang permanently:** If the condition function throws, the error is swallowed inside the `setInterval` callback. The timeout and interval keep running but the promise never settles — it leaks indefinitely.
>
> ```typescript
> await delaySkippable(3000, () => {
>   throw new Error('oops')  // promise hangs forever ❌
> })
> ```
>
> Always keep `condition` side-effect-free and guaranteed not to throw.

---

## delayWithAbort

Pauses execution until the delay expires or an `AbortSignal` fires. Rejects with `AbortError` when aborted.

```typescript
delayWithAbort(ms: number, signal: AbortSignal): Promise<void>
```

```typescript
const controller = new AbortController()
setTimeout(() => controller.abort(), 500)

try {
  await delayWithAbort(3000, controller.signal)
  console.log('completed')
} catch (e) {
  if ((e as DOMException).name === 'AbortError') {
    console.log('aborted after 500ms')
  }
}
```

If the signal is already aborted when called, rejects immediately. Once aborted, the promise will not resolve even if the full duration passes.

Use `delaySkippable` when you control the condition yourself. Use `delayWithAbort` when you need to integrate with the native `AbortController` API — for example, cancelling fetch requests and delays together with the same signal.

> **Abort reason is ignored:** `delayWithAbort` always rejects with `new DOMException('Delay aborted', 'AbortError')` regardless of what was passed to `controller.abort(reason)`. If your code relies on the abort reason, extract it from `signal.reason` directly in the catch block.
>
> ```typescript
> try {
>   await delayWithAbort(3000, signal)
> } catch (e) {
>   console.log(signal.reason)  // read the reason here instead ✅
> }
> ```

> **`DOMException` is not available in Node.js before v18:** `DOMException` became a global in Node 18. In older Node versions, this function throws a `ReferenceError` instead of `AbortError` when the signal fires. If you need to support Node < 18, polyfill `DOMException` or check your runtime version.

---

## repeat

Calls a function N times with a delay between each call. The callback receives the current index (0-based).

```typescript
repeat(times: number, ms: number, fn: (index: number) => void | Promise<void>): Promise<void>
```

```typescript
await repeat(3, 500, i => console.log(`tick ${i}`))
// "tick 0" → 500ms → "tick 1" → 500ms → "tick 2"
```

No delay is added after the last call — only between calls. `times = 0` never calls the function and resolves immediately.

```typescript
// async callbacks are supported — errors propagate normally
await repeat(3, 1000, async i => {
  const data = await fetchPage(i)
  process(data)
})

// if fn throws, the error rejects the promise and remaining iterations are skipped
await repeat(3, 500, async () => {
  await syncWithServer()  // throws → repeat rejects immediately ✅
})