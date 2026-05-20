# Emitter

```typescript
import { createEmitter } from 'duckkit/emitter'
import type { Emitter } from 'duckkit/emitter'
```

A fully typed event emitter. Define your event map once — TypeScript enforces correct payload types on every `emit` and `on` call throughout your codebase.

---

## createEmitter

Creates a new emitter instance scoped to your event map.

```typescript
createEmitter<Events extends Record<string, unknown>>(): Emitter<Events>
```

```typescript
const emitter = createEmitter<{
  win: number
  spin: void
  error: { code: number; message: string }
}>()

// on — payload type is inferred from the event map
emitter.on('win', amount => console.log(amount))   // amount: number ✅
emitter.on('spin', () => console.log('spin!'))     // no payload ✅
emitter.on('error', e => console.log(e.code))      // e: { code, message } ✅

// emit — payload required for typed events, omitted for void events
emitter.emit('win', 500)      // ✅
emitter.emit('spin')          // ✅ — no second arg
emitter.emit('win')           // TypeScript error — payload missing ❌
emitter.emit('win', 'hello')  // TypeScript error — string, not number ❌
```

---

## on

Subscribes to an event. Returns an unsubscribe function.

```typescript
on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void
```

```typescript
const off = emitter.on('win', amount => {
  updateDisplay(amount)
})

// later — unsubscribe cleanly
off()
```

Multiple handlers can be subscribed to the same event. They fire in subscription order.

---

## off

Unsubscribes a specific handler. The handler reference must match — anonymous functions can't be removed this way.

```typescript
off<K extends keyof Events>(event: K, handler: Handler<Events[K]>): void
```

```typescript
const handler = (amount: number) => updateDisplay(amount)
emitter.on('win', handler)
emitter.off('win', handler)  // removed ✅

emitter.on('win', amount => console.log(amount))
emitter.off('win', amount => console.log(amount))  // no effect — different reference ⚠️
```

Prefer the unsubscribe function returned by `on` when you don't need to keep a named handler reference.

---

## once

Subscribes to an event for one call only. Automatically unsubscribes after the first emit. Returns an unsubscribe function to cancel early.

```typescript
once<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void
```

```typescript
emitter.once('win', amount => {
  console.log('first win:', amount)
  // won't fire again even if 'win' is emitted multiple times
})

// cancel before it fires
const cancel = emitter.once('spin', () => doSomething())
cancel()  // handler will never be called
```

---

## emit

Emits an event, calling all subscribed handlers synchronously in subscription order.

```typescript
emit<K extends keyof Events>(
  ...args: Events[K] extends void ? [event: K] : [event: K, payload: Events[K]]
): void
```

```typescript
emitter.emit('win', 500)
emitter.emit('spin')
emitter.emit('error', { code: 404, message: 'Not found' })
```

Handlers are called synchronously — emit returns after all handlers finish.

> **Errors in handlers propagate and stop remaining handlers:** If one handler throws, subsequent handlers in the same emit call are not called. Guard inside handlers if partial execution is a concern.
>
> ```typescript
> emitter.on('win', () => { throw new Error('oops') })
> emitter.on('win', () => console.log('this never runs'))
>
> emitter.emit('win', 100)  // throws — second handler skipped ⚠️
> ```

---

## clear

Removes all handlers for a specific event, or all handlers on the emitter if called without arguments.

```typescript
clear(event?: keyof Events): void
```

```typescript
emitter.clear('win')  // removes all 'win' handlers
emitter.clear()       // removes everything
```

Useful for cleanup on component unmount or scene teardown.

---

## Typing the emitter

Export the `Emitter` type when passing an emitter around:

```typescript
import type { Emitter } from 'duckkit/emitter'

type GameEvents = {
  win: number
  spin: void
  bonusStart: { multiplier: number }
}

class GameManager {
  readonly events: Emitter<GameEvents> = createEmitter()

  spin() {
    // ... spin logic
    this.events.emit('spin')
    this.events.emit('win', 500)
  }
}

// consumers subscribe without knowing internals
manager.events.on('win', amount => updateBalance(amount))
```

Making `events` readonly prevents external code from calling `clear()` or emitting events directly — expose only `on` if you want stricter encapsulation:

```typescript
class GameManager {
  private _events = createEmitter<GameEvents>()

  // expose only the subscribe side
  readonly on = this._events.on.bind(this._events)
  readonly once = this._events.once.bind(this._events)
}
```