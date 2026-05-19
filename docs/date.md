# Date

```typescript
import { formatDate, timeAgo, addDays, startOfDay, isSameDay, ... } from 'duckkit/date'
```

All functions are non-mutating — they always return a new `Date` object.

---

## timeAgo

Returns a human-readable relative time string from a past date.

```typescript
timeAgo(date: Date): string
```

```typescript
timeAgo(new Date(Date.now() - 30_000))          // "just now"
timeAgo(new Date(Date.now() - 3 * 60_000))      // "3 minutes ago"
timeAgo(new Date(Date.now() - 90 * 60_000))     // "1 hour ago"
timeAgo(new Date(Date.now() - 25 * 3600_000))   // "yesterday"
timeAgo(new Date(Date.now() - 4 * 86400_000))   // "4 days ago"
timeAgo(new Date(Date.now() - 14 * 86400_000))  // "2 weeks ago"
timeAgo(new Date(Date.now() - 32 * 86400_000))  // "1 month ago"
timeAgo(new Date(Date.now() - 400 * 86400_000)) // "1 year ago"
```

Handles singular/plural correctly — "1 minute ago" not "1 minutes ago".

---

## formatDate

Formats a date using token-based format strings.

```typescript
formatDate(date: Date, format: string): string
```

| Token | Output | Example |
|-------|--------|---------|
| `YYYY` | Full year | 2026 |
| `YY` | 2-digit year | 26 |
| `MMMM` | Full month name | January |
| `MMM` | Short month name | Jan |
| `MM` | Zero-padded month | 01–12 |
| `M` | Month | 1–12 |
| `DD` | Zero-padded day | 01–31 |
| `D` | Day | 1–31 |
| `HH` | Zero-padded hours | 00–23 |
| `H` | Hours | 0–23 |
| `mm` | Zero-padded minutes | 00–59 |
| `ss` | Zero-padded seconds | 00–59 |

```typescript
formatDate(new Date(), 'DD/MM/YYYY')   // "13/05/2026"
formatDate(new Date(), 'MMM D, YYYY')  // "May 13, 2026"
formatDate(new Date(), 'MMMM YYYY')    // "May 2026"
formatDate(new Date(), 'HH:mm:ss')     // "09:05:03"
formatDate(new Date(), 'YY')           // "26"
```

Unknown tokens are preserved as-is — `'YYYY-[Q1]'` → `'2026-[Q1]'`.

---

## daysBetween

Returns the number of full days between two dates. Order doesn't matter — always returns a positive number.

```typescript
daysBetween(a: Date, b: Date): number
```

```typescript
daysBetween(new Date('2026-01-01'), new Date('2026-12-31'))  // 364
daysBetween(new Date('2026-12-31'), new Date('2026-01-01'))  // 364 — symmetric
daysBetween(new Date('2026-01-01'), new Date('2026-01-01'))  // 0
daysBetween(new Date('2024-02-28'), new Date('2024-03-01'))  // 2 — leap year
```

Uses UTC midnight internally to avoid daylight saving time edge cases.

---

## addDays

Adds a specified number of days to a date. Non-mutating.

```typescript
addDays(date: Date, days: number): Date
```

```typescript
addDays(new Date(), 7)    // one week from now
addDays(new Date(), 30)   // 30 days from now
addDays(new Date(), -5)   // 5 days ago (use negative to subtract)
```

---

## subDays

Subtracts a specified number of days from a date. Non-mutating.

```typescript
subDays(date: Date, days: number): Date
```

```typescript
subDays(new Date(), 7)   // one week ago
subDays(new Date(), 30)  // 30 days ago
```

---

## addMonths

Adds a specified number of months to a date. Non-mutating.

```typescript
addMonths(date: Date, months: number): Date
```

```typescript
addMonths(new Date(), 3)   // 3 months from now
addMonths(new Date(), -1)  // last month
```

Note: Adding 1 month to Jan 31 overflows to March — this is JavaScript's native `Date` behavior.

---

## addYears

Adds a specified number of years to a date. Non-mutating.

```typescript
addYears(date: Date, years: number): Date
```

```typescript
addYears(new Date(), 1)   // next year
addYears(new Date(), -2)  // 2 years ago
```

Preserves month and day.

---

## isBefore / isAfter

Compares two dates by timestamp. Time of day is included in the comparison.

```typescript
isBefore(a: Date, b: Date): boolean
isAfter(a: Date, b: Date): boolean
```

```typescript
isBefore(new Date('2026-01-01'), new Date('2026-12-31'))  // true
isAfter(new Date('2026-12-31'), new Date('2026-01-01'))   // true

isBefore(deadline, new Date())   // has deadline passed?
isAfter(new Date(), eventStart)  // has event started?
```

Returns `false` for equal dates.

---

## isSameDay

Returns `true` if two dates fall on the same calendar day. Ignores time of day.

```typescript
isSameDay(a: Date, b: Date): boolean
```

```typescript
isSameDay(new Date('2026-05-13T08:00'), new Date('2026-05-13T22:00'))  // true
isSameDay(new Date('2026-05-13'), new Date('2026-05-14'))              // false
isSameDay(new Date('2026-05-13'), new Date('2025-05-13'))              // false — different year
```

---

## startOfDay / endOfDay

Returns a new date set to the start or end of the day.

```typescript
startOfDay(date: Date): Date  // 00:00:00.000
endOfDay(date: Date): Date    // 23:59:59.999
```

```typescript
startOfDay(new Date('2026-05-13T14:30:00'))
// 2026-05-13T00:00:00.000

endOfDay(new Date('2026-05-13T08:00:00'))
// 2026-05-13T23:59:59.999
```

Useful for building date range queries — `startOfDay` as the lower bound, `endOfDay` as the upper bound.

---

## startOfWeek

Returns a new date set to the start of the week (Sunday at 00:00:00.000).

```typescript
startOfWeek(date: Date): Date
```

```typescript
startOfWeek(new Date('2026-05-13'))  // Wednesday → Sunday May 10
startOfWeek(new Date('2026-05-10'))  // Sunday → returns itself
startOfWeek(new Date('2026-05-16'))  // Saturday → Sunday May 10
```

Week starts on Sunday (day 0).

---

## startOfMonth

Returns a new date set to the first day of the month at 00:00:00.000.

```typescript
startOfMonth(date: Date): Date
```

```typescript
startOfMonth(new Date('2026-05-13'))  // 2026-05-01T00:00:00.000
startOfMonth(new Date('2026-01-31'))  // 2026-01-01T00:00:00.000
```

---

## Boolean date checks

Quick checks against the current date/time.

```typescript
isToday(date: Date): boolean      // true if date is today
isYesterday(date: Date): boolean  // true if date was yesterday
isWeekend(date: Date): boolean    // true if Saturday or Sunday
isThisWeek(date: Date): boolean   // true if within current Sun–Sat week
isThisYear(date: Date): boolean   // true if same calendar year as now
```

```typescript
isToday(new Date())                          // true
isYesterday(new Date(Date.now() - 86400000)) // true
isWeekend(new Date('2026-05-16'))            // true — Saturday
isThisWeek(new Date())                       // true
isThisYear(new Date())                       // true
```