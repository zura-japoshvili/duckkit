# Fn

```typescript
import { pipeline, compose, pipelineAsync, composeAsync, curry, tap, when } from 'duckkit/fn'
```

Function composition utilities. Complements `pipe` (which threads a single value) by producing reusable composed functions.

| | Direction | Returns |
|---|---|---|
| `pipe` | left → right | the final value |
| `pipeline` | left → right | a reusable function |
| `compose` | right → left | a reusable function |
| `pipelineAsync` | left → right | a reusable async function |
| `composeAsync` | right → left | a reusable async function |
| `tap` | — | side effect, value unchanged |
| `when` | — | conditional transform |

All overloaded up to 5 steps. TypeScript infers every intermediate type — no `any` in the chain.

---

## pipeline

Composes functions left to right. Returns a new typed function from the first input to the final output.

```typescript
pipeline<A, B, C, ...>(f1, f2, f3, ...): (a: A) => FinalOutput
```

```typescript
const process = pipeline(
  (s: string) => s.trim(),
  s => s.toUpperCase(),
  s => s.split(' '),
)

process('  hello world  ')  // ["HELLO", "WORLD"]
process('  foo bar  ')      // ["FOO", "BAR"] — reusable ✅
```

Each step's output type feeds the next step's input type. TypeScript catches mismatches immediately:

```typescript
const broken = pipeline(
  (s: string) => s.split(' '),   // returns string[]
  s => s.toUpperCase(),          // TypeScript error — string[] has no toUpperCase ❌
)
```

**`pipeline` vs `pipe`:** `pipe(value).through(fn).value()` threads a single value once. `pipeline(fn1, fn2)` returns a function you store and call many times.

```typescript
// pipe — one-off value threading
const result = pipe('hello').through(s => s.toUpperCase()).value()

// pipeline — reusable composed function
const transform = pipeline((s: string) => s.toUpperCase())
['hello', 'world'].map(transform)  // ['HELLO', 'WORLD']
```

---

## compose

Same as `pipeline` but right to left — `compose(f, g)(x)` runs `g` first, then `f`.

```typescript
compose<A, B, C, ...>(fLast, ..., fFirst): (a: A) => FinalOutput
```

```typescript
const process = compose(
  (arr: string[]) => arr.join('-'),   // runs third
  (s: string) => s.split(' '),        // runs second
  (s: string) => s.toUpperCase(),     // runs first
)

process('hello world')  // "HELLO-WORLD"
```

---

## pipelineAsync

Like `pipeline` but each step can return a `Promise`. Steps are awaited in order.

```typescript
pipelineAsync<A, B, C, ...>(f1, f2, f3, ...): (a: A) => Promise<FinalOutput>
```

```typescript
const processUser = pipelineAsync(
  (id: string) => fetchUser(id),      // async
  user => normalizeUser(user),        // sync — works too
  user => saveToCache(user),          // async
)

const user = await processUser('abc123')  // fully typed ✅
```

> **One rejection stops the pipeline:** If any step rejects, remaining steps are skipped and the error propagates.

---

## composeAsync

Like `compose` but each step can return a `Promise`. Executes right to left.

```typescript
composeAsync<A, B, C, ...>(fLast, ..., fFirst): (a: A) => Promise<FinalOutput>
```

```typescript
const process = composeAsync(
  (user: User) => saveToCache(user),
  (user: User) => normalizeUser(user),
  (id: string) => fetchUser(id),
)

await process('abc123')
```

---

## curry

Converts a multi-argument function into a chain of single-argument functions. Supports 2- and 3-argument functions.

```typescript
curry(fn: (a: A, b: B) => R): (a: A) => (b: B) => R
curry(fn: (a: A, b: B, c: C) => R): (a: A) => (b: B) => (c: C) => R
```

```typescript
const multiply = curry((factor: number, value: number) => value * factor)

[1, 2, 3].map(multiply(2))   // [2, 4, 6] ✅
[1, 2, 3].map(multiply(10))  // [10, 20, 30] ✅

// 3-arg
const clamp = curry((min: number, max: number, value: number) =>
  Math.min(Math.max(value, min), max)
)
const clamp0to100 = clamp(0)(100)
clamp0to100(150)  // 100
clamp0to100(-5)   // 0
```

> **Only works reliably without default params or rest args:** `curry` uses `fn.length` which stops counting at the first default parameter.

> **4+ arg functions are returned as-is.**

---

## tap

Runs a side effect on the value and passes it through unchanged. Useful for logging or debugging inside pipelines without breaking the chain.

```typescript
tap<T>(fn: (value: T) => void): (value: T) => T
```

```typescript
const process = pipeline(
  (s: string) => s.trim(),
  tap(s => console.log('after trim:', s)),  // logs, value unchanged ✅
  s => s.toUpperCase(),
)

process('  hello  ')
// logs: "hello"
// returns: "HELLO"
```

The side effect receives the current value. The return value of `fn` is ignored — `tap` always returns the original value.

> **Mutations inside `tap` affect the value:** `tap` returns the same reference, not a copy. If the side effect mutates the value (e.g. `arr.push()`), those mutations are visible downstream. Keep side effects read-only (logging, metrics, debugging).

---

## when

Conditionally applies a function. If the predicate returns `true`, applies `fn` and returns the result. Otherwise returns the value unchanged.

```typescript
when<T>(predicate: (value: T) => boolean, fn: (value: T) => T): (value: T) => T
```

```typescript
const process = pipeline(
  (n: number) => n * 2,
  when(n => n > 10, n => n + 100),
  n => String(n),
)

process(3)   // "6"   — 3*2=6, condition false, skipped
process(10)  // "120" — 10*2=20, condition true, +100 applied
```

```typescript
// normalize only non-empty strings
const clean = pipeline(
  when((s: string) => s.length > 0, s => s.trim().toLowerCase()),
)

clean('  HELLO  ')  // "hello"
clean('')           // "" — untouched
```

> **Input and output types must match:** `when` returns `T` in both branches, so `fn` must return the same type as its input. It can't be used to change the type conditionally — use a regular ternary for that.