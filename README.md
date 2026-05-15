# duckkit

[![npm version](https://img.shields.io/npm/v/duckkit.svg)](https://www.npmjs.com/package/duckkit)
[![npm downloads](https://img.shields.io/npm/dm/duckkit.svg)](https://www.npmjs.com/package/duckkit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/duckkit)](https://bundlephobia.com/package/duckkit)
[![license](https://img.shields.io/npm/l/duckkit.svg)](https://github.com/zura-japoshvili/duckkit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-blue)](https://www.typescriptlang.org/)

TypeScript-first utility library. Zero dependencies, tree-shakeable, fully typed.

A collection of everyday utilities for TypeScript developers — typed array operations, object helpers, date formatting, async tools, string manipulation, number math, delays, and validation. Everything you keep writing from scratch in every project, packaged once with real types.

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
import { groupBy, flatGroupBy, topBy, sortBy, partition } from 'duckkit/array'
import { safe, safeAsync, pipe, memo, debounce, throttle, retry, timeout } from 'duckkit/async'
import { formatDate, timeAgo, daysBetween, addDays, isBefore } from 'duckkit/date'
import { pick, omit, deepMerge, isEqual, deepClone } from 'duckkit/object'
import { clamp, lerp, roundTo, truncateTo, randomInt, inRange } from 'duckkit/number'
import { slugify, camelCase, capitalize, randomId, isEmpty } from 'duckkit/string'
import { delay, delaySkippable, delayWithAbort, repeat } from 'duckkit/delay'
import { isEmail, isUrl, isUUID, isNumeric } from 'duckkit/validate'
```

---

## Array

### `groupBy`
Groups an array by a key. Returns real types — the value type is inferred from your data.

```typescript
const users = [
  { name: 'Zura', country: 'GE' },
  { name: 'Alice', country: 'US' },
  { name: 'Giorgi', country: 'GE' },
]

const grouped = groupBy(users, x => x.country)
// { GE: User[], US: User[] }

grouped.GE[0].name  // type: string ✅
```

---

### `flatGroupBy`
Groups items by multiple keys per item. Each item can appear under several groups simultaneously.

```typescript
const artists = [
  { name: 'Gorillaz', genres: ['alternative', 'electronic'] },
  { name: 'Arctic Monkeys', genres: ['rock', 'alternative'] },
]

flatGroupBy(artists, a => a.genres)
// {
//   alternative: [Gorillaz, ArcticMonkeys],
//   electronic:  [Gorillaz],
//   rock:        [ArcticMonkeys],
// }
```

Perfect for tags, genres, labels — anything where one item belongs to multiple groups.

---

### `topBy`
Returns the top N items by a numeric criteria. Non-mutating.

```typescript
topBy(songs, x => x.plays, 2)
// top 2 most played — typed, original not mutated ✅
```

---

### `sortBy`
Sorts an array by a numeric or string criteria. Non-mutating.

```typescript
sortBy(users, x => x.name)              // alphabetical ascending
sortBy(songs, x => x.plays, 'desc')     // most played first
```

---

### `minBy` / `maxBy`
Returns the item with the lowest or highest value by criteria.

```typescript
minBy(products, x => x.price)  // cheapest — undefined if empty
maxBy(products, x => x.price)  // most expensive — undefined if empty
```

---

### `partition`
Splits an array into two groups based on a predicate.

```typescript
const [admins, users] = partition(people, x => x.role === 'admin')

const [evens, odds] = partition([1, 2, 3, 4, 5], n => n % 2 === 0)
// evens: [2, 4] — odds: [1, 3, 5]
```

---

### `chunk`
Splits an array into chunks of a given size. Last chunk may be smaller.

```typescript
chunk([1, 2, 3, 4, 5], 2)
// [[1, 2], [3, 4], [5]]

for (const batch of chunk(emails, 50)) {
  await sendBatch(batch)
}
```

---

### `unique`
Removes duplicates. With a key function, deduplicates objects by a derived value.

```typescript
unique([1, 2, 2, 3, 1])       // [1, 2, 3]
unique(users, x => x.id)       // removes duplicate ids, keeps first occurrence
```

---

### `zip`
Combines two arrays into an array of pairs. Stops at the shorter array.

```typescript
zip(['a', 'b', 'c'], [1, 2, 3])
// [['a', 1], ['b', 2], ['c', 3]] — typed as [string, number][] ✅

Object.fromEntries(zip(keys, values))
```

---

## Object

### `pick`
Creates a new object with only the specified keys. Removes unwanted keys from the type.

```typescript
const user = { name: 'Zura', email: 'z@z.com', password: 'secret' }

pick(user, ['name', 'email'])
// { name: 'Zura', email: 'z@z.com' }
// type: { name: string, email: string } ✅
```

---

### `omit`
Creates a new object without the specified keys. Removed keys disappear from the type.

```typescript
omit(user, ['password'])
// { name: 'Zura', email: 'z@z.com' }
// accessing .password is now a compile error ✅
```

---

### `deepMerge`
Recursively merges two objects. Nested objects are merged not replaced. Arrays are replaced.

```typescript
const config = deepMerge(
  { server: { port: 3000, host: 'localhost' }, debug: false },
  { server: { port: 8080 } }
)
// { server: { port: 8080, host: 'localhost' }, debug: false }
// host preserved ✅ — original not mutated ✅
```

---

### `isEqual`
Deep equality check. Handles objects, arrays, dates, primitives.

```typescript
isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })  // true
isEqual([1, 2, 3], [1, 2, 3])                             // true
isEqual(new Date('2026-01-01'), new Date('2026-01-01'))   // true
isEqual({ a: 1 }, { a: 2 })                              // false
```

---

### `deepClone`
True deep clone. Preserves `Date` objects — unlike `JSON.parse` which converts them to strings.

```typescript
const original = { a: 1, b: { c: 2 }, date: new Date() }
const clone = deepClone(original)

clone.b.c = 99
original.b.c               // still 2 ✅
clone.date instanceof Date  // true ✅
```

---

### `mapKeys`
Transforms all keys of an object. Values stay unchanged.

```typescript
mapKeys({ first_name: 'Zura', last_name: 'J' }, k => camelCase(k))
// { firstName: 'Zura', lastName: 'J' }
```

---

### `mapValues`
Transforms all values of an object. Keys stay unchanged.

```typescript
mapValues({ apple: 1.5, banana: 0.8 }, price => price * 0.9)
// { apple: 1.35, banana: 0.72 }
```

---

## Async / Utility

### `safe`
Wraps a function in a Result type. Returns `{ ok: true, value }` or `{ ok: false, error }`. No more try/catch.

```typescript
const result = safe(() => JSON.parse(rawString))

if (result.ok) {
  console.log(result.value)   // typed ✅
} else {
  console.error(result.error.message)  // typed Error ✅
}
```

---

### `safeAsync`
Same as `safe` but for async functions. Never rejects — always resolves to Ok or Err.

```typescript
const result = await safeAsync(() => fetch('/api/user').then(r => r.json()))

if (result.ok) renderUser(result.value)
else showError(result.error.message)
```

---

### `pipe`
Chains transformations. Each step is fully typed.

```typescript
const result = pipe('  hello world  ')
  .through(s => s.trim())
  .through(s => s.toUpperCase())
  .through(s => s.split(' '))
  .through(arr => arr.join('-'))
  .value()
// "HELLO-WORLD"
```

---

### `memo`
Memoizes a function — caches return values by arguments.

```typescript
const calculate = memo((n: number) => n * n * n)
calculate(5)  // runs
calculate(5)  // cached instantly
```

---

### `debounce`
Fires only after the delay has passed since the last call.

```typescript
const onSearch = debounce((query: string) => fetchResults(query), 300)
input.addEventListener('input', e => onSearch(e.target.value))
```

---

### `throttle`
Fires immediately then ignores calls until the interval passes.

```typescript
const onScroll = throttle(() => updatePosition(), 100)
window.addEventListener('scroll', onScroll)
// fires immediately, then at most once every 100ms
```

---

### `retry`
Retries an async function up to N times. Supports exponential backoff.

```typescript
const data = await retry(() => fetchUser(id), 3, 1000)
// tries up to 3 times, 1s between each

await retry(() => fetchData(), 3, 200, true)
// exponential backoff — 200ms, 400ms, 800ms
```

---

### `timeout`
Races a promise against a timer. Rejects with `TimeoutError` if timer wins.

```typescript
try {
  const data = await timeout(fetchUser(id), 5000)
} catch (e) {
  if (e instanceof TimeoutError) console.log('too slow')
}
```

---

## Date

### `timeAgo`
Returns a human-readable relative time string from a past date.

```typescript
timeAgo(new Date(Date.now() - 30_000))          // "just now"
timeAgo(new Date(Date.now() - 3 * 60_000))      // "3 minutes ago"
timeAgo(new Date(Date.now() - 25 * 3600_000))   // "yesterday"
timeAgo(new Date(Date.now() - 14 * 86400_000))  // "2 weeks ago"
timeAgo(new Date(Date.now() - 400 * 86400_000)) // "1 year ago"
```

---

### `formatDate`
Formats a date using token-based format strings.

| Token | Output |
|-------|--------|
| `YYYY` | 2026 |
| `YY` | 26 |
| `MMMM` | January |
| `MMM` | Jan |
| `MM` | 01 |
| `M` | 1 |
| `DD` | 09 |
| `D` | 9 |
| `HH:mm:ss` | 09:05:03 |

```typescript
formatDate(new Date(), 'DD/MM/YYYY')   // "13/05/2026"
formatDate(new Date(), 'MMM D, YYYY')  // "May 13, 2026"
formatDate(new Date(), 'HH:mm:ss')     // "09:05:03"
```

---

### `daysBetween`
Returns the number of full days between two dates. Order doesn't matter — always positive.

```typescript
daysBetween(new Date('2026-01-01'), new Date('2026-12-31'))  // 364
daysBetween(new Date('2024-02-28'), new Date('2024-03-01'))  // 2 (leap year)
```

---

### `addDays` / `subDays`
Add or subtract days from a date. Non-mutating.

```typescript
addDays(new Date(), 7)   // one week from now
subDays(new Date(), 7)   // one week ago
```

---

### `isBefore` / `isAfter`
Safe date comparison helpers.

```typescript
isBefore(new Date('2026-01-01'), new Date('2026-12-31'))  // true
isAfter(new Date('2026-12-31'), new Date('2026-01-01'))   // true

isBefore(deadline, new Date())  // has deadline passed?
isAfter(new Date(), eventStart) // has event started?
```

---

### Boolean date checks

```typescript
isToday(date)     // true if date is today
isYesterday(date) // true if date was yesterday
isWeekend(date)   // true if Saturday or Sunday
isThisWeek(date)  // true if within current Sun–Sat week
isThisYear(date)  // true if same calendar year as now
```

---

## Number

### `clamp`
Constrains a number between a min and max.

```typescript
clamp(150, 0, 100)      // 100
clamp(-10, 0, 100)      // 0
clamp(userInput, 0, 1)  // safe opacity value
```

---

### `lerp`
Linear interpolation between two values by factor `t`.

```typescript
lerp(0, 100, 0.5)  // 50

// smooth movement — 10% closer to target each frame
position = lerp(position, target, 0.1)
```

---

### `roundTo`
Rounds to a specified number of decimal places.

```typescript
roundTo(1.2345, 2)  // 1.23
roundTo(1.7)        // 2
```

---

### `truncateTo`
Truncates without rounding — always floors toward zero. Safe for financial values.

```typescript
truncateTo(5.059, 2)  // 5.05 — never rounds up
truncateTo(5.999, 2)  // 5.99
```

---

### `randomInt`
Returns a random integer between min and max, inclusive.

```typescript
randomInt(1, 6)    // dice roll
randomInt(0, 100)  // random percentage
```

---

### `inRange`
Returns true if value is between min and max, inclusive.

```typescript
inRange(5, 1, 10)   // true
inRange(0, 1, 10)   // false

if (!inRange(age, 0, 120)) throw new Error('invalid age')
```

---

## String

### Case conversion

```typescript
camelCase('foo_bar_baz')   // "fooBarBaz"
snakeCase('fooBarBaz')     // "foo_bar_baz"
kebabCase('fooBarBaz')     // "foo-bar-baz"
pascalCase('foo_bar_baz')  // "FooBarBaz"
titleCase('hello world')   // "Hello World"
capitalize('hello world')  // "Hello world"
```

---

### `slugify`
Converts a string to a URL-safe slug.

```typescript
slugify('Hello World!')     // "hello-world"
slugify('My Blog Post #1')  // "my-blog-post-1"
```

---

### `truncate`
Truncates a string to a max length, appending a suffix if cut.

```typescript
truncate('Hello World', 8)        // "Hello..."
truncate('Hello World', 8, ' →')  // "Hello →"
truncate('Hi', 8)                 // "Hi" — fits, unchanged
```

---

### `isEmpty`
Returns true if the string is empty or contains only whitespace.

```typescript
isEmpty('')      // true
isEmpty('   ')   // true
isEmpty('hello') // false
```

---

### `randomId`
Generates a random alphanumeric ID.

```typescript
randomId()     // "xK9mP2qL"
randomId(12)   // "xK9mP2qLwZ4n"
```

---

### `countOccurrences`
Counts non-overlapping occurrences of a substring.

```typescript
countOccurrences('hello world hello', 'hello')  // 2
countOccurrences('mississippi', 's')            // 4
```

---

## Delay

### `delay`
Pauses async execution for a given number of milliseconds.

```typescript
await delay(1000)
```

---

### `delaySkippable`
Waits up to `ms` milliseconds but resolves early if a condition becomes true.

```typescript
let skip = false
button.onclick = () => { skip = true }

await delaySkippable(3000, () => skip)
```

---

### `delayWithAbort`
Uses the native `AbortController` API. Rejects with `AbortError` when the signal fires.

```typescript
const controller = new AbortController()
setTimeout(() => controller.abort(), 500)

try {
  await delayWithAbort(3000, controller.signal)
} catch (e) {
  console.log('aborted')
}
```

---

### `repeat`
Calls a function N times with a delay between each call.

```typescript
await repeat(3, 500, i => console.log(`tick ${i}`))
// "tick 0" → 500ms → "tick 1" → 500ms → "tick 2"
```

---

## Validate

### `isEmail`
```typescript
isEmail('zura@example.com')  // true
isEmail('invalid-email')     // false
```

### `isUrl`
```typescript
isUrl('https://example.com')  // true
isUrl('example.com')          // false — missing protocol
```

### `isUUID`
```typescript
isUUID('550e8400-e29b-41d4-a716-446655440000')  // true
isUUID('not-a-uuid')                            // false
```

### `isNumeric`
```typescript
isNumeric('42')     // true
isNumeric('3.14')   // true
isNumeric('12abc')  // false
isNumeric('')       // false
```

---

## License

MIT — [Zura Japoshvili](https://github.com/zura-japoshvili)