# Date

```typescript
import { formatDate, timeAgo, addDays, startOfDay, isSameDay, ... } from 'duckkit/date'
```

All functions are non-mutating — they always return a new `Date` object.

> **All functions use local time:** Every function in this module uses local-time getters (`getDate`, `getMonth`, `getFullYear`, etc.). This means results depend on the runtime's timezone.
>
> The most common footgun: date-only strings like `new Date('2026-01-01')` are parsed as **UTC midnight** by JavaScript. In a UTC−5 timezone, that's Dec 31, 2025 at 7pm local time — so `startOfDay`, `isToday`, `isSameDay`, and `formatDate` will all treat it as Dec 31, not Jan 1.
>
> ```typescript
> // In UTC-5 timezone:
> formatDate(new Date('2026-01-01'), 'DD/MM/YYYY')  // "31/12/2025" ⚠️
> isToday(new Date('2026-05-20'))                    // may be false ⚠️
> ```
>
> To avoid this, always create dates with explicit time components or use `new Date()` directly:
>
> ```typescript
> new Date('2026-01-01T00:00:00')   // local midnight ✅
> new Date(2026, 0, 1)              // local midnight ✅
> new Date('2026-01-01')            // UTC midnight ⚠️ — shifts by timezone
> ```

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

> **Future dates always return "just now":** The diff is negative for future dates, which makes `seconds < 60` always true. Any future date — whether 5 minutes or 5 years ahead — silently returns `"just now"`.
>
> ```typescript
> timeAgo(new Date(Date.now() + 999999999))  // "just now" ⚠️
> ```
>
> If you need to handle future dates, check before calling: `date <= new Date() ? timeAgo(date) : timeUntil(date)`.

> **"yesterday" is elapsed-time based, not calendar-aware:** The check is `days === 1`, meaning exactly 24–48 hours ago — not "the previous calendar day". A date from 23 hours ago on a different calendar day returns `"23 hours ago"`, not `"yesterday"`. A date from 36 hours ago returns `"yesterday"` even if it was two calendar days back.
>
> ```typescript
> // It's 1am. This date is 2 hours ago but was yesterday on the calendar:
> timeAgo(new Date(Date.now() - 2 * 3600_000))  // "2 hours ago" — not "yesterday" ⚠️
> ```

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

> **No unpadded minute or second tokens:** The table has `H` for unpadded hours but no equivalent `m` (unpadded minutes) or `s` (unpadded seconds). Only the zero-padded `mm` and `ss` are available. If you need `"9:5"` instead of `"09:05"`, you'll need to format those parts manually.

> **Output depends on local timezone** — see the note at the top of this page. UTC date strings like `new Date('2026-01-01')` may produce the wrong day in non-UTC timezones.

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

Uses `setDate` internally — adds calendar days, not milliseconds. DST transitions are handled correctly.

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

> **End-of-month overflow goes to the next month, not the last valid day:** Adding 1 month to Jan 31 does not clamp to Feb 28 — JavaScript's `setMonth` overflows to March 3 (or March 2 in a leap year). This is native JS behavior with no clamping.
>
> ```typescript
> addMonths(new Date('2026-01-31'), 1)  // 2026-03-03 ⚠️ — not Feb 28
> addMonths(new Date('2026-03-31'), 1)  // 2026-05-01 ⚠️ — April has 30 days
> ```
>
> If you need safe end-of-month clamping, clamp the day after adding:
>
> ```typescript
> function addMonthsClamped(date: Date, months: number): Date {
>   const result = new Date(date.getFullYear(), date.getMonth() + months + 1, 0)
>   const target = new Date(date.getFullYear(), date.getMonth() + months, date.getDate())
>   return target.getMonth() !== (date.getMonth() + months + 12) % 12 ? result : target
> }
> ```

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

Preserves month and day. Adding 1 year to Feb 29 on a leap year overflows to March 1 on a non-leap year — same JS `setFullYear` behavior as `addMonths`.

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

Returns `false` for equal dates. Use `startOfDay` to compare dates without time of day:

```typescript
isBefore(startOfDay(a), startOfDay(b))  // date-only comparison
```

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

Uses local-time getters — see the timezone note at the top.

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

Useful for building date range queries — `startOfDay` as the lower bound, `endOfDay` as the upper bound. Both use local midnight, not UTC midnight.

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

> **Week starts on Sunday — not configurable:** Day 0 is Sunday. This matches the US convention but not ISO 8601 or most European locales, which start on Monday. If you need Monday-first weeks, subtract 1 from the result and adjust:
>
> ```typescript
> function startOfWeekMonday(date: Date): Date {
>   const d = startOfWeek(date)
>   const day = date.getDay()
>   d.setDate(d.getDate() + (day === 0 ? -6 : 1))
>   return d
> }
> ```

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
isToday(new Date())                           // true
isYesterday(new Date(Date.now() - 86400000))  // true
isWeekend(new Date('2026-05-16'))             // true — Saturday
isThisWeek(new Date())                        // true
isThisYear(new Date())                        // true
```

All checks are calendar-day based using local time. `isThisWeek` uses a Sunday–Saturday window. See the timezone note at the top — UTC date strings may fall on an unexpected local day.