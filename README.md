# duckkit 🦆

[![npm version](https://img.shields.io/npm/v/duckkit.svg)](https://www.npmjs.com/package/duckkit)
[![npm downloads](https://img.shields.io/npm/dm/duckkit.svg)](https://www.npmjs.com/package/duckkit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/duckkit)](https://bundlephobia.com/package/duckkit)
[![license](https://img.shields.io/npm/l/duckkit.svg)](https://github.com/zura-japoshvili/duckkit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-blue)](https://www.typescriptlang.org/)

TypeScript-first utility library. Zero dependencies, tree-shakeable, fully typed.

Covers array, object, string, number, date, async, delay, emitter, and function composition utilities. Each function is properly typed — no `any`, no `Record<string, unknown>` workarounds. Import everything or per category, only what you use ends up in the bundle.

---

## Overview

A comprehensive TypeScript utility library that provides:

- **Zero Dependencies** — lightweight and self-contained, nothing pulled in
- **Tree-Shakeable** — import per category, only what you use ends up in the bundle
- **Fully Typed** — no `any`, no `Record<string, unknown>` workarounds, proper generics throughout
- **ESM + CJS** — works in Node.js, browsers, and bundlers
- **Typed `groupBy`** — returns `Record<K, T[]>`, not `Dictionary<any>`
- **`deepClone` that preserves Dates** — unlike the `JSON.parse(JSON.stringify(...))` trick
- **`safe` / Result type** — try/catch as a typed value, no untyped throws
- **`delaySkippable`** — cancellable async wait, unique to duckkit
- **Typed event emitter** — payload types enforced at compile time
- **Function composition** — `pipeline`, `compose`, `curry`, `tap`, `when` with full type inference

---

## Install

```bash
npm install duckkit
```

---

## Key Features

### Array Utilities
- Typed `groupBy` — returns `Record<K, T[]>`, not `any`
- `partition`, `topBy`, `minBy`, `maxBy`, `chunk`, `compact`, `unique`
- `shuffle`, `flatten`, `range`, `zip`, `without`, `union`, `intersection`, `difference`
- `countBy`, `keyBy`, `sum`, `sumBy`, `sample`

### Object Utilities
- `deepClone` — preserves `Date` objects, unlike `JSON.parse(JSON.stringify(...))`
- `deepMerge` — nested merge with Date support, non-mutating
- `pick`, `omit` — removed keys disappear from the TypeScript type entirely
- `flattenObject`, `unflattenObject`, `invertObject`
- `mapKeys`, `mapValues`, `filterKeys`, `filterValues`
- Typed `keys`, `values`, `entries`, `fromEntries`

### Async & Error Handling
- `safe` / `safeAsync` — try/catch as a typed `Result` value
- `retry` with optional exponential backoff
- `memo` / `memoAsync` with `maxSize` cache eviction
- `debounce`, `throttle`, `once`, `defer`
- `parallel` with concurrency limit, `sequential`
- `timeout` — races a promise against a timer

### Date Utilities
- `timeAgo` — human-readable relative time ("3 minutes ago")
- `formatDate` — token-based formatting (`MMM D, YYYY`, `HH:mm:ss`)
- `addDays`, `addMonths`, `addYears`, `subDays`, `daysBetween`
- `startOfDay`, `endOfDay`, `startOfWeek`, `startOfMonth`
- `isSameDay`, `isBefore`, `isAfter`
- `isToday`, `isYesterday`, `isWeekend`, `isThisWeek`, `isThisYear`

### Number Utilities
- `clamp`, `lerp`, `normalize` — common math for animations and game dev
- `roundTo`, `truncateTo` — decimal precision without floating-point surprises
- `formatBytes` — `1048576` → `"1 MB"`
- `formatDuration` — `3661` → `"1h 1m 1s"`
- `toOrdinal` — `21` → `"21st"`
- `toRoman`, `formatNumber`, `randomInt`, `inRange`, `average`

### String Utilities
- Case conversion: `camelCase`, `snakeCase`, `kebabCase`, `pascalCase`, `titleCase`
- `slugify` — URL-safe slug generation
- `mask` — `"4242424242424242"` → `"************4242"`
- `escapeHtml` / `unescapeHtml` — XSS-safe HTML encoding
- `template` — `"Hello {name}!"` interpolation
- `truncate`, `excerpt` — cut at character or word boundary
- `randomId` — cryptographically secure via `crypto.getRandomValues`
- `stripHtml`, `words`, `isEmpty`, `countOccurrences`

### Delay Utilities
- `delay` — simple `await delay(1000)`
- `delaySkippable` — resolves early if a condition becomes true (unique to duckkit)
- `delayWithAbort` — native `AbortController` integration
- `repeat` — call a function N times with a delay between each

### Typed Event Emitter
- Define your event map once — TypeScript enforces payload types on every `emit` and `on`
- `on`, `off`, `once`, `emit`, `clear`
- Typos and wrong payload types are caught at compile time, not runtime

### Function Composition
- `pipeline` / `compose` — reusable typed composed functions
- `pipelineAsync` / `composeAsync` — async steps, sync and async freely mixed
- `curry` — partial application with full type inference
- `tap` — side effects inside a pipeline without breaking the chain
- `when` — conditionally apply a transform

---

## Why duckkit?

### Typed `groupBy` — not `any`

```typescript
// lodash — returns Dictionary<User[]>, basically any
const grouped = _.groupBy(users, x => x.country)

// duckkit — returns Record<"GE" | "US", User[]>
const grouped = groupBy(users, x => x.country)
grouped.GE[0].name  // string ✅ — full autocomplete, no any
```

### `deepClone` that preserves `Date` objects

```typescript
// JSON trick — everyone uses it, everyone hits this bug
const clone = JSON.parse(JSON.stringify(obj))
clone.createdAt  // string ❌ — Date became a string

// duckkit
const clone = deepClone(obj)
clone.createdAt  // Date ✅
```

### `safe` — try/catch as a value

```typescript
// before
let data
try {
  data = JSON.parse(raw)
} catch (e) { ... }

// duckkit
const result = safe(() => JSON.parse(raw))
if (result.ok) console.log(result.value)  // typed ✅
```

### `delaySkippable` — cancellable wait

```typescript
// resolves after 3s, or immediately if userClickedSkip becomes true
await delaySkippable(3000, () => userClickedSkip)
```

### Typed event emitter

```typescript
const emitter = createEmitter<{
  win: number
  spin: void
}>()

emitter.emit('win', 500)     // ✅
emitter.emit('win', 'oops')  // ❌ TypeScript error
emitter.emit('wiiin', 500)   // ❌ typo caught at compile time
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
import { clamp, lerp, roundTo, average, toOrdinal, formatBytes, formatDuration } from 'duckkit/number'
import { slugify, camelCase, escapeHtml, template, mask, excerpt } from 'duckkit/string'
import { delay, delaySkippable, delayWithAbort, repeat } from 'duckkit/delay'
import { createEmitter } from 'duckkit/emitter'
import { pipeline, compose, pipelineAsync, composeAsync, curry, tap, when } from 'duckkit/fn'
```

---

## Documentation

Full API documentation with examples and edge case notes:

| Module | Docs |
|--------|------|
| Array | [docs/array.md](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md) |
| Object | [docs/object.md](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md) |
| Async | [docs/async.md](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md) |
| Date | [docs/date.md](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md) |
| Number | [docs/number.md](https://github.com/zura-japoshvili/duckkit/blob/main/docs/number.md) |
| String | [docs/string.md](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md) |
| Delay | [docs/delay.md](https://github.com/zura-japoshvili/duckkit/blob/main/docs/delay.md) |
| Emitter | [docs/emitter.md](https://github.com/zura-japoshvili/duckkit/blob/main/docs/emitter.md) |
| Fn | [docs/fn.md](https://github.com/zura-japoshvili/duckkit/blob/main/docs/fn.md) |

---

## License

MIT — [Zura Japoshvili](https://github.com/zura-japoshvili)