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
// async callbacks are supported
await repeat(3, 1000, async i => {
  const data = await fetchPage(i)
  processs(data)
})

// retry pattern
await repeat(3, 2000, async () => {
  await syncWithServer()
})
```