# duckkit

TypeScript-first utility library. Zero dependencies, tree-shakeable, fully typed.

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
import { groupBy, flatGroupBy, topBy } from 'duckkit/array'
import { safe, safeAsync, pipe, memo, debounce } from 'duckkit/async'
import { formatDate, timeAgo, daysBetween } from 'duckkit/date'
import { pick, omit, deepMerge, mapKeys, mapValues } from 'duckkit/object'
import { clamp, lerp, roundTo, truncateTo, randomInt, inRange } from 'duckkit/number'
import { slugify, camelCase, capitalize, randomId, isEmpty } from 'duckkit/string'
import { delay, delaySkippable, delayWithAbort, repeat } from 'duckkit/delay'
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
const songs = [
  { title: 'Feels', plays: 1200 },
  { title: 'Redbone', plays: 8500 },
  { title: 'Slide', plays: 3100 },
]

topBy(songs, x => x.plays, 2)
// [{ title: 'Redbone', plays: 8500 }, { title: 'Slide', plays: 3100 }]
```

---

### `chunk`
Splits an array into chunks of a given size. Last chunk may be smaller.

```typescript
chunk([1, 2, 3, 4, 5], 2)
// [[1, 2], [3, 4], [5]]

// process in batches
for (const batch of chunk(emails, 50)) {
  await sendBatch(batch)
}
```

---

### `unique`
Removes duplicates. With a key function, deduplicates objects by a derived value.

```typescript
unique([1, 2, 2, 3, 1])          // [1, 2, 3]
unique(users, x => x.id)          // removes duplicate ids, keeps first occurrence
unique(users, x => x.email)       // removes duplicate emails
```

---

### `zip`
Combines two arrays into an array of pairs. Stops at the shorter array.

```typescript
zip(['a', 'b', 'c'], [1, 2, 3])
// [['a', 1], ['b', 2], ['c', 3]]
// typed as [string, number][] ✅

Object.fromEntries(zip(keys, values))  // quick object from two arrays
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
// host is preserved ✅ — original not mutated ✅
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

mapValues({ a: 1, b: 2 }, (value, key) => `${key}=${value}`)
// { a: 'a=1', b: 'b=2' }
```

---

## Async / Utility

### `safe`
Wraps a function in a Result type. Returns `{ ok: true, value }` or `{ ok: false, error }`. No more try/catch.

```typescript
const result = safe(() => JSON.parse(rawString))

if (result.ok) {
  console.log(result.value)  // typed ✅
} else {
  console.error(result.error.message)  // typed Error ✅
}
```

---

### `safeAsync`
Same as `safe` but for async functions. Never rejects — always resolves to Ok or Err.

```typescript
const result = await safeAsync(() => fetch('/api/user').then(r => r.json()))

if (result.ok) {
  renderUser(result.value)
} else {
  showError(result.error.message)
}
```

---

### `pipe`
Chains transformations. Each step is fully typed — the output of one step is the input of the next.

```typescript
const result = pipe('  hello world  ')
  .through(s => s.trim())           // string
  .through(s => s.toUpperCase())    // string
  .through(s => s.split(' '))       // string[]
  .through(arr => arr.join('-'))    // string
  .value()
// "HELLO-WORLD"
```

---

### `memo`
Memoizes a function — caches return values by arguments. Subsequent calls with the same args return instantly.

```typescript
const calculate = memo((n: number) => {
  // expensive work
  return n * n * n
})

calculate(5)  // runs
calculate(5)  // cached — function never called again
calculate(6)  // runs — different arg
```

---

### `debounce`
Returns a debounced version of a function. Only fires after the specified delay has passed since the last call.

```typescript
const onSearch = debounce((query: string) => {
  fetchResults(query)
}, 300)

// user types fast — fetchResults only called once, 300ms after they stop
input.addEventListener('input', e => onSearch(e.target.value))
```

---

## Date

### `timeAgo`
Returns a human-readable relative time string from a past date.

```typescript
timeAgo(new Date(Date.now() - 30_000))          // "just now"
timeAgo(new Date(Date.now() - 3 * 60_000))      // "3 minutes ago"
timeAgo(new Date(Date.now() - 3 * 3600_000))    // "3 hours ago"
timeAgo(new Date(Date.now() - 25 * 3600_000))   // "yesterday"
timeAgo(new Date(Date.now() - 14 * 86400_000))  // "2 weeks ago"
timeAgo(new Date(Date.now() - 400 * 86400_000)) // "1 year ago"
```

---

### `formatDate`
Formats a date using token-based format strings.

| Token | Output example |
|-------|---------------|
| `YYYY` | 2026 |
| `YY` | 26 |
| `MMMM` | January |
| `MMM` | Jan |
| `MM` | 01 |
| `M` | 1 |
| `DD` | 09 |
| `D` | 9 |
| `HH` | 09 |
| `H` | 9 |
| `mm` | 05 |
| `ss` | 03 |

```typescript
formatDate(new Date(), 'DD/MM/YYYY')   // "13/05/2026"
formatDate(new Date(), 'MMM D, YYYY')  // "May 13, 2026"
formatDate(new Date(), 'MMMM YYYY')    // "May 2026"
formatDate(new Date(), 'HH:mm:ss')     // "09:05:03"
```

---

### `daysBetween`
Returns the number of full days between two dates. Order doesn't matter — always positive.

```typescript
daysBetween(new Date('2026-01-01'), new Date('2026-12-31'))  // 364
daysBetween(new Date('2024-02-28'), new Date('2024-03-01'))  // 2 (leap year)
daysBetween(a, b) === daysBetween(b, a)                      // always true
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
clamp(150, 0, 100)  // 100
clamp(-10, 0, 100)  // 0
clamp(50,  0, 100)  // 50

clamp(userInput, 0, 1)  // safe opacity value
```

---

### `lerp`
Linear interpolation between two values by factor `t`.

```typescript
lerp(0, 100, 0)    // 0
lerp(0, 100, 0.5)  // 50
lerp(0, 100, 1)    // 100

// smooth movement — 10% closer to target each frame
position = lerp(position, target, 0.1)
```

---

### `roundTo`
Rounds to a specified number of decimal places.

```typescript
roundTo(1.2345, 2)  // 1.23
roundTo(1.235, 2)   // 1.24
roundTo(1.7)        // 2
roundTo(1234, -2)   // 1200
```

---

### `truncateTo`
Truncates without rounding — always floors toward zero. Useful for financial values where you must never overstate.

```typescript
truncateTo(5.059, 2)  // 5.05 — never rounds up
truncateTo(5.999, 2)  // 5.99
truncateTo(9.9)       // 9
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
Returns true if value is between min and max, inclusive on both ends.

```typescript
inRange(5, 1, 10)   // true
inRange(0, 1, 10)   // false
inRange(10, 1, 10)  // true

if (!inRange(age, 0, 120)) throw new Error('invalid age')
```

---

## String

### Case conversion

```typescript
camelCase('foo_bar_baz')   // "fooBarBaz"
camelCase('foo-bar-baz')   // "fooBarBaz"

snakeCase('fooBarBaz')     // "foo_bar_baz"
snakeCase('foo-bar-baz')   // "foo_bar_baz"

kebabCase('fooBarBaz')     // "foo-bar-baz"
kebabCase('foo_bar_baz')   // "foo-bar-baz"

pascalCase('foo_bar_baz')  // "FooBarBaz"
pascalCase('foo-bar-baz')  // "FooBarBaz"

titleCase('hello world')   // "Hello World"
capitalize('hello world')  // "Hello world"
```

---

### `slugify`
Converts a string to a URL-safe slug.

```typescript
slugify('Hello World!')       // "hello-world"
slugify('My Blog Post #1')    // "my-blog-post-1"
slugify('  extra   spaces  ') // "extra-spaces"
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
isEmpty('\n\t')  // true
isEmpty('hello') // false
```

---

### `randomId`
Generates a random alphanumeric ID. Useful for UI keys, temp IDs, session tokens.

```typescript
randomId()     // "xK9mP2qL"
randomId(12)   // "xK9mP2qLwZ4n"
randomId(4)    // "xK9m"
```

---

### `countOccurrences`
Counts non-overlapping occurrences of a substring.

```typescript
countOccurrences('hello world hello', 'hello')  // 2
countOccurrences('mississippi', 's')            // 4
countOccurrences('aaa', 'aa')                   // 1 (non-overlapping)
```

---

## Delay

### `delay`
Pauses async execution for a given number of milliseconds.

```typescript
await delay(1000)  // waits 1 second

console.log('start')
await delay(500)
console.log('500ms later')
```

---

### `delaySkippable`
Waits up to `ms` milliseconds but resolves early if a condition becomes true.

```typescript
let skip = false
button.onclick = () => { skip = true }

await delaySkippable(3000, () => skip)
// resolves after 3s, or immediately when skip = true
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
  console.log('aborted')  // fires after 500ms
}
```

---

### `repeat`
Calls a function N times with a delay between each call.

```typescript
await repeat(3, 500, i => console.log(`tick ${i}`))
// "tick 0" → 500ms → "tick 1" → 500ms → "tick 2"

// retry with delay between attempts
await repeat(3, 1000, async () => {
  await fetchData()
})
```

---

## License

MIT