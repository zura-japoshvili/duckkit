# Array

```typescript
import { groupBy, partition, sortBy, chunk, ... } from 'duckkit/array'
```

---

## groupBy

Groups an array by a key. Returns properly typed `Record<K, T[]>` — not `Record<string, any>`.

```typescript
groupBy<T, K extends string>(arr: T[], fn: (item: T) => K): Record<K, T[]>
```

```typescript
const users = [
  { name: 'Zura', country: 'GE' },
  { name: 'Alice', country: 'US' },
  { name: 'Giorgi', country: 'GE' },
]

const grouped = groupBy(users, x => x.country)
// { GE: User[], US: User[] }

grouped.GE[0].name  // string ✅ — not any
```

> **Type safety gotcha:** The return type `Record<K, T[]>` tells TypeScript every key of `K` is present. But at runtime, only keys that actually appear in the array exist — accessing an absent key returns `undefined`, not an empty array.
>
> ```typescript
> type Status = 'active' | 'inactive' | 'banned'
> const grouped = groupBy(users, x => x.status as Status)
>
> grouped.banned        // TypeScript: T[] ✅
> grouped.banned[0]     // Runtime: TypeError if no banned users exist ❌
> ```
>
> Always guard before accessing, or cast the return type:
>
> ```typescript
> grouped.banned?.length
>
> // or be explicit about optionality
> groupBy(...) as Partial<Record<Status, User[]>>
> ```

---

## flatGroupBy

Like `groupBy` but each item can belong to multiple groups. Returns `Record<string, T[]>`.

```typescript
flatGroupBy<T>(arr: T[], fn: (item: T) => string[]): Record<string, T[]>
```

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

Items with no keys are excluded from all groups. Useful for tags, genres, categories.

---

## sortBy

Sorts an array by a numeric or string criteria. Non-mutating.

```typescript
sortBy<T>(arr: T[], fn: (item: T) => string | number, order?: 'asc' | 'desc'): T[]
```

```typescript
sortBy(users, x => x.name)              // alphabetical ascending
sortBy(users, x => x.name, 'desc')      // alphabetical descending
sortBy(songs, x => x.plays, 'desc')     // most played first
```

Original array is never mutated. Returns a new sorted array.

> **Stable sort:** When two items have the same key, their relative order matches the original array. Guaranteed in all modern JS engines (ES2019+).
>
> ```typescript
> const tasks = [
>   { name: 'B', priority: 1 },
>   { name: 'A', priority: 1 },
> ]
> sortBy(tasks, x => x.priority)
> // [{ name: 'B' }, { name: 'A' }] — original order preserved on tie ✅
> ```

---

## topBy

Returns the top N items by a numeric criteria. Non-mutating.

```typescript
topBy<T>(arr: T[], fn: (item: T) => number, n: number): T[]
```

```typescript
topBy(songs, x => x.plays, 3)   // top 3 most played
topBy(users, x => x.score, 10)  // top 10 by score
```

If `n` exceeds the array length, returns all items sorted. `n = 0` returns empty array.

---

## minBy / maxBy

Returns the item with the lowest or highest value. Returns `undefined` for empty arrays.

```typescript
minBy<T>(arr: T[], fn: (item: T) => number): T | undefined
maxBy<T>(arr: T[], fn: (item: T) => number): T | undefined
```

```typescript
minBy(products, x => x.price)  // cheapest product
maxBy(players, x => x.score)   // highest scoring player
minBy([], x => x.v)            // undefined ✅ — safe on empty arrays
```

On ties, returns the first matching item.

---

## partition

Splits an array into two groups based on a predicate. Returns `[matches, nonMatches]`.

```typescript
partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]]
```

```typescript
const [admins, users] = partition(people, x => x.role === 'admin')
const [evens, odds] = partition([1, 2, 3, 4, 5], n => n % 2 === 0)
// evens: [2, 4] — odds: [1, 3, 5]
```

Order within each group is preserved.

---

## chunk

Splits an array into chunks of a given size. Last chunk may be smaller.

```typescript
chunk<T>(arr: T[], size: number): T[][]
```

```typescript
chunk([1, 2, 3, 4, 5], 2)
// [[1, 2], [3, 4], [5]]

for (const batch of chunk(emails, 50)) {
  await sendBatch(batch)
}
```

Throws if `size <= 0`.

---

## unique

Removes duplicates. With a key function, deduplicates objects by a derived value. O(n) using a Set.

```typescript
unique<T>(arr: T[], fn?: (item: T) => unknown): T[]
```

```typescript
unique([1, 2, 2, 3, 1])          // [1, 2, 3]
unique(users, x => x.id)          // removes duplicate ids
unique(users, x => x.email)       // removes duplicate emails
```

Keeps the first occurrence. Order is preserved.

---

## zip

Combines two arrays into an array of pairs. Stops at the shorter array.

```typescript
zip<A, B>(a: A[], b: B[]): [A, B][]
```

```typescript
zip(['a', 'b', 'c'], [1, 2, 3])
// [['a', 1], ['b', 2], ['c', 3]] — typed as [string, number][] ✅

Object.fromEntries(zip(keys, values))  // quick object from two arrays
```

> **Unequal lengths:** Items from the longer array beyond the shorter array's length are silently dropped — no error, no padding.
>
> ```typescript
> zip([1, 2, 3], ['a', 'b'])
> // [[1, 'a'], [2, 'b']] — 3 is dropped silently ⚠️
>
> // If you need to keep all items, pad the shorter array first
> const padded = [...shortArr, ...Array(longArr.length - shortArr.length).fill(null)]
> zip(longArr, padded)
> ```

---

## flatten

Flattens an array one level deep.

```typescript
flatten<T>(arr: T[][]): T[]
```

```typescript
flatten([[1, 2], [3, 4], [5]])  // [1, 2, 3, 4, 5]
flatten(users.map(u => u.tags)) // all tags in one array
```

Only flattens one level. For deeper nesting use native `Array.flat(depth)`.

---

## range

Creates an array of numbers from `start` to `end` (exclusive).

```typescript
range(start: number, end: number, step?: number): number[]
```

```typescript
range(0, 5)       // [0, 1, 2, 3, 4]
range(0, 10, 2)   // [0, 2, 4, 6, 8]
range(5, 0, -1)   // [5, 4, 3, 2, 1]
range(5, 5)       // []
```

Throws if `step` is 0. Returns empty array if direction conflicts with step.

> **Float steps:** Float steps work but produce floating-point results due to standard JS precision. Round the output if you need clean decimals.
>
> ```typescript
> range(0, 1, 0.1)
> // [0, 0.1, 0.2, 0.30000000000000004, ...]  ⚠️
>
> range(0, 1, 0.1).map(n => Math.round(n * 10) / 10)
> // [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]  ✅
> ```

---

## compact

Removes all falsy values. Unlike `filter(Boolean)`, properly narrows the type.

```typescript
compact<T>(arr: (T | null | undefined | false | 0 | '')[]): T[]
```

```typescript
compact([1, null, 2, undefined, 3, false, 0, ''])
// [1, 2, 3] — type is number[] ✅

compact(users.map(u => u.email))
// string[] — nulls removed, type narrowed ✅
```

---

## sample

Returns a random item from an array.

```typescript
sample<T>(arr: T[]): T | undefined
```

```typescript
sample(['rock', 'paper', 'scissors'])  // random each time
sample([])                             // undefined ✅
```

---

## shuffle

Returns a new array with items in random order. Uses Fisher-Yates algorithm. Non-mutating.

```typescript
shuffle<T>(arr: T[]): T[]
```

```typescript
shuffle([1, 2, 3, 4, 5])  // [3, 1, 5, 2, 4] — different each time
shuffle(questions)         // randomized quiz questions
```

---

## without

Returns a new array with specified values removed. All occurrences are removed.

```typescript
without<T>(arr: T[], ...values: T[]): T[]
```

```typescript
without([1, 2, 3, 4, 5], 2, 4)       // [1, 3, 5]
without(['a', 'b', 'c', 'a'], 'a')    // ['b', 'c']
without([1, 2, 1, 2, 1], 1)          // [2, 2]
```

> **Value not found:** If none of the excluded values exist in the array, returns a shallow copy of the original unchanged — no error, no signal.
>
> ```typescript
> without([1, 2, 3], 99)  // [1, 2, 3] — copy, not the same reference
> without([], 1, 2, 3)    // []
> ```

---

## union

Merges two arrays and removes duplicates. With a key function, deduplicates objects by a derived value.

```typescript
union<T>(a: T[], b: T[], fn?: (item: T) => unknown): T[]
```

```typescript
union([1, 2, 3], [2, 3, 4, 5])  // [1, 2, 3, 4, 5]

union(localUsers, remoteUsers, x => x.id)
// merged list, no duplicate ids — items from a take priority ✅
```

---

## intersection

Returns items that exist in both arrays. Uses a Set internally — O(n + m).

```typescript
intersection<T>(a: T[], b: T[], fn?: (item: T) => unknown): T[]
```

```typescript
intersection([1, 2, 3, 4], [2, 4, 6])  // [2, 4]

intersection(usersA, usersB, x => x.id)
// users that exist in both lists
```

Order of the first array is preserved.

---

## difference

Returns items from `a` that do not exist in `b`. Uses a Set internally — O(n + m).

```typescript
difference<T>(a: T[], b: T[], fn?: (item: T) => unknown): T[]
```

```typescript
difference([1, 2, 3, 4], [2, 4])  // [1, 3]

difference(allUsers, activeUsers, x => x.id)
// users that are not active
```

---

## countBy

Groups items by a key and returns counts instead of arrays.

```typescript
countBy<T>(arr: T[], fn: (item: T) => string): Record<string, number>
```

```typescript
countBy(users, x => x.country)
// { GE: 3, US: 1, DE: 2 }

countBy(orders, x => x.status)
// { pending: 4, shipped: 12, delivered: 8 }
```

> **Empty array:** Returns `{}`, not `0` or `null`. Guard with `??` if you need a fallback count.
>
> ```typescript
> countBy([], x => x.country)  // {}
>
> const counts = countBy(users, x => x.country)
> const geCount = counts.GE ?? 0
> ```

---

## keyBy

Converts an array into an object keyed by a derived value. O(1) lookup instead of O(n) `.find()`.

```typescript
keyBy<T>(arr: T[], fn: (item: T) => string): Record<string, T>
```

```typescript
const byId = keyBy(users, x => x.id)
byId['abc123']  // instant lookup ✅ — no .find() needed
```

On duplicate keys, last item wins.

---

## sum / sumBy

Sums an array of numbers, or sums a numeric field across all items.

```typescript
sum(arr: number[]): number
sumBy<T>(arr: T[], fn: (item: T) => number): number
```

```typescript
sum([1, 2, 3, 4, 5])                        // 15
sumBy(orders, x => x.total)                  // total revenue
sumBy(cart, x => x.price * x.quantity)       // cart total
```

Returns 0 for empty arrays.