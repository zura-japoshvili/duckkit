# duckkit

[![npm version](https://img.shields.io/npm/v/duckkit.svg)](https://www.npmjs.com/package/duckkit)
[![npm downloads](https://img.shields.io/npm/dm/duckkit.svg)](https://www.npmjs.com/package/duckkit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/duckkit)](https://bundlephobia.com/package/duckkit)
[![license](https://img.shields.io/npm/l/duckkit.svg)](https://github.com/zura-japoshvili/duckkit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-blue)](https://www.typescriptlang.org/)

TypeScript-first utility library. Zero dependencies, tree-shakeable, fully typed.

Covers array, object, string, number, date, async, delay, emitter, and function composition utilities. Each function is properly typed — no any, no Record<string, unknown> workarounds. Import everything or per category, only what you use ends up in the bundle.

Includes things native JS still doesn't have — typed groupBy, partition, deepClone that preserves Date objects, safe/safeAsync for try/catch-free error handling, delaySkippable for cancellable waits, a fully typed event emitter, and more. Built to cover the helpers you keep writing from scratch in every project.

---

## Install

```bash
npm install duckkit
```

---

## Import

```typescript
// everything
import { groupBy, safe, pipe, clamp, slugify, delay } from 'duckkit'

// or per category — fully tree-shakeable
import { groupBy, partition, sortBy, chunk } from 'duckkit/array'
import { safe, safeAsync, pipe, retry, timeout, once, defer } from 'duckkit/async'
import { formatDate, timeAgo, addDays, startOfDay, isSameDay } from 'duckkit/date'
import { pick, omit, deepMerge, deepClone, flattenObject } from 'duckkit/object'
import { clamp, lerp, roundTo, average, toOrdinal, formatBytes } from 'duckkit/number'
import { slugify, camelCase, escapeHtml, template, mask, excerpt } from 'duckkit/string'
import { delay, delaySkippable, delayWithAbort, repeat } from 'duckkit/delay'
import { createEmitter } from 'duckkit/emitter'
import { pipeline, compose, pipelineAsync, composeAsync, curry } from 'duckkit/fn'
```

---

## Array

`groupBy` `flatGroupBy` `sortBy` `topBy` `minBy` `maxBy` `partition` `chunk` `unique` `zip` `flatten` `range` `compact` `sample` `shuffle` `without` `union` `intersection` `difference` `countBy` `keyBy` `sum` `sumBy`

```typescript
groupBy(users, x => x.country)
// { GE: User[], US: User[] } — typed, not Record<string, any> ✅

const [admins, rest] = partition(users, x => x.admin)

compact([1, null, 2, undefined, 3])  // [1, 2, 3] — type narrowed ✅
```

→ [Full array docs](docs/array.md)

---

## Object

`pick` `omit` `deepMerge` `deepClone` `isEqual` `mapKeys` `mapValues` `invertObject` `flattenObject` `unflattenObject` `filterKeys` `filterValues` `keys` `values` `entries` `fromEntries`

```typescript
pick(user, ['name', 'email'])   // removes password from type ✅
omit(user, ['password'])        // .password is now a compile error ✅

deepMerge(defaults, overrides)  // nested objects merged, not replaced — Date values preserved ✅
```

→ [Full object docs](docs/object.md)

---

## Async

`safe` `safeAsync` `pipe` `memo` `memoAsync` `debounce` `throttle` `retry` `timeout` `once` `defer` `parallel` `sequential`

```typescript
const result = safe(() => JSON.parse(raw))
if (result.ok) console.log(result.value)  // typed ✅

await retry(() => fetchUser(id), 3, 1000)       // 3 attempts, 1s between
await parallel([fetchA, fetchB, fetchC], { concurrency: 2 })

// bounded cache — safe for long-running apps
const getUser = memoAsync(fetchUser, { maxSize: 100 })
```

→ [Full async docs](docs/async.md)

---

## Date

`timeAgo` `formatDate` `daysBetween` `addDays` `subDays` `addMonths` `addYears` `isBefore` `isAfter` `isSameDay` `startOfDay` `endOfDay` `startOfWeek` `startOfMonth` `isToday` `isYesterday` `isWeekend` `isThisWeek` `isThisYear`

```typescript
timeAgo(new Date(Date.now() - 3 * 60_000))  // "3 minutes ago"
formatDate(new Date(), 'MMM D, YYYY')        // "May 13, 2026"
addDays(new Date(), 30)                      // deadline in 30 days
```

→ [Full date docs](docs/date.md)

---

## Number

`clamp` `lerp` `roundTo` `truncateTo` `randomInt` `inRange` `average` `normalize` `toOrdinal` `toRoman` `formatNumber` `formatBytes`

```typescript
clamp(userInput, 0, 1)         // safe opacity value
lerp(position, target, 0.1)    // smooth animation step
toOrdinal(21)                  // "21st"
formatBytes(1048576)           // "1 MB"
```

→ [Full number docs](docs/number.md)

---

## String

`capitalize` `truncate` `slugify` `excerpt` `camelCase` `snakeCase` `kebabCase` `pascalCase` `titleCase` `isEmpty` `randomId` `countOccurrences` `escapeHtml` `unescapeHtml` `template` `words` `mask` `stripHtml`

```typescript
slugify('Hello World!')                      // "hello-world"
mask('4242424242424242')                     // "************4242"
template('Hello {name}!', { name: 'Zura' }) // "Hello Zura!"
escapeHtml('<script>alert("xss")</script>')  // safe ✅
```

→ [Full string docs](docs/string.md)

---

## Delay

`delay` `delaySkippable` `delayWithAbort` `repeat`

```typescript
await delay(1000)
await delaySkippable(3000, () => userSkipped)  // resolves early if skipped
await repeat(3, 500, i => console.log(`tick ${i}`))
```

→ [Full delay docs](docs/delay.md)

---

## Emitter

`createEmitter`

A fully typed event emitter. Define your event map once — TypeScript enforces correct payload types on every `emit` and `on` call. Use `void` for events with no payload.

```typescript
const emitter = createEmitter<{
  win: number
  spin: void
  error: { code: number; message: string }
}>()

emitter.on('win', amount => console.log(amount))  // amount: number ✅
emitter.emit('win', 500)
emitter.emit('spin')                              // no payload needed ✅
emitter.emit('win', 'oops')                       // TypeScript error ❌

// unsubscribe
const off = emitter.on('win', handler)
off()

// fire once, then auto-unsubscribe
emitter.once('win', amount => showBigWin(amount))
```

→ [Full emitter docs](docs/emitter.md)

---

## Fn

`pipeline` `compose` `pipelineAsync` `composeAsync` `curry`

Function composition utilities. `pipeline` and `compose` return reusable typed functions — unlike `pipe` which threads a single value. All overloaded up to 5 steps with full type inference.

```typescript
// pipeline — left to right, returns a reusable function
const process = pipeline(
  (s: string) => s.trim(),
  s => s.toUpperCase(),
  s => s.split(' '),
)
process('  hello world  ')  // ["HELLO", "WORLD"] ✅ — reusable

// compose — right to left
const process = compose(
  (arr: string[]) => arr.join('-'),
  (s: string) => s.split(' '),
  (s: string) => s.toUpperCase(),
)
process('hello world')  // "HELLO-WORLD"

// async steps supported
const processUser = pipelineAsync(
  (id: string) => fetchUser(id),    // async
  user => normalizeUser(user),      // sync — works too
  user => saveToCache(user),        // async
)
const user = await processUser('abc123')  // fully typed ✅

// curry — partial application with full type inference
const multiply = curry((factor: number, value: number) => value * factor)
[1, 2, 3].map(multiply(2))   // [2, 4, 6] ✅
[1, 2, 3].map(multiply(10))  // [10, 20, 30] ✅
```

→ [Full fn docs](docs/fn.md)

---

## License

MIT — [Zura Japoshvili](https://github.com/zura-japoshvili)