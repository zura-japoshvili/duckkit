# Fn

```typescript
import { pipeline, compose, pipelineAsync, composeAsync, curry } from 'duckkit/fn'
```

Function composition utilities. Complements `pipe` (which threads a single value) by producing reusable composed functions.

| | Direction | Returns |
|---|---|---|
| `pipe` | left → right | the final value |
| `pipeline` | left → right | a reusable function |
| `compose` | right → left | a reusable function |
| `pipelineAsync` | left → right | a reusable async function |
| `composeAsync` | right → left | a reusable async function |

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

`pipeline` and `compose` produce identical results — they're the same operation, arguments in opposite order. Use whichever matches how you think about the data flow.

---

## pipelineAsync

Like `pipeline` but each step can return a `Promise`. Steps are awaited in order.

```typescript
pipelineAsync<A, B, C, ...>(f1, f2, f3, ...): (a: A) => Promise<FinalOutput>
```

```typescript
const processUser = pipelineAsync(
  (id: string) => fetchUser(id),      // async — Promise<User>
  user => normalizeUser(user),        // sync — User (awaited automatically)
  user => saveToCache(user),          // async — Promise<User>
)

const user = await processUser('abc123')  // User ✅
```

Sync and async steps can be freely mixed — sync return values are treated as already resolved.

> **One rejection stops the pipeline:** If any step rejects, remaining steps are skipped and the error propagates. Same behavior as `await` in a sequential chain.

---

## composeAsync

Like `compose` but each step can return a `Promise`. Executes right to left.

```typescript
composeAsync<A, B, C, ...>(fLast, ..., fFirst): (a: A) => Promise<FinalOutput>
```

```typescript
const process = composeAsync(
  (user: User) => saveToCache(user),    // runs last
  (user: User) => normalizeUser(user),  // runs second
  (id: string) => fetchUser(id),        // runs first
)

await process('abc123')
```

---

## curry

Converts a multi-argument function into a chain of single-argument functions. Supports 2- and 3-argument functions. All types are inferred.

```typescript
curry(fn: (a: A, b: B) => R): (a: A) => (b: B) => R
curry(fn: (a: A, b: B, c: C) => R): (a: A) => (b: B) => (c: C) => R
```

```typescript
// 2-arg
const add = curry((a: number, b: number) => a + b)
const add5 = add(5)    // (b: number) => number
add5(3)                // 8
add5(10)               // 15

// 3-arg
const between = curry((min: number, max: number, value: number) =>
  value >= min && value <= max
)
const is0to100 = between(0)(100)  // (value: number) => boolean
is0to100(50)   // true
is0to100(150)  // false
```

Common use — partial application with array methods:

```typescript
const multiply = curry((factor: number, value: number) => value * factor)

[1, 2, 3].map(multiply(2))   // [2, 4, 6] ✅
[1, 2, 3].map(multiply(10))  // [10, 20, 30] ✅
```

> **Only works reliably with named functions — not rest args or default params:** `curry` uses `fn.length` to detect arity. `fn.length` only counts parameters before the first default or rest parameter.
>
> ```typescript
> const fn = (a: number, b = 0, c: number) => a + b + c
> fn.length  // 1 — stops at the first default parameter ⚠️
>
> curry(fn)  // treated as 1-arg, wrapping does nothing ❌
> ```
>
> Stick to plain positional parameters with no defaults.

> **4+ arg functions are returned as-is:** If you pass a function with 4 or more arguments, `curry` returns it unchanged — no error, no currying. For those cases, curry manually or chain `pipeline` instead.
>
> ```typescript
> const fn = curry((a: number, b: number, c: number, d: number) => a + b + c + d)
> fn(1)  // returns the original function uncurried ⚠️
> ```