# Number

```typescript
import { clamp, lerp, roundTo, truncateTo, randomInt, inRange, average, normalize, toOrdinal, toRoman, formatNumber, formatBytes } from 'duckkit/number'
```

---

## clamp

Constrains a number between a minimum and maximum value.

```typescript
clamp(value: number, min: number, max: number): number
```

```typescript
clamp(150, 0, 100)  // 100 — above max
clamp(-10, 0, 100)  // 0   — below min
clamp(50,  0, 100)  // 50  — within range

clamp(userInput, 0, 1)   // safe opacity value
clamp(volume, 0, 100)    // safe volume level
```

Returns `min` when `min === max`.

> **`min > max` silently produces wrong results:** `Math.min(Math.max(value, min), max)` always returns `max` when `min > max`, regardless of `value`. No error is thrown.
>
> ```typescript
> clamp(50, 100, 0)  // 0 — always ⚠️
> clamp(5,  100, 0)  // 0 — always ⚠️
> ```
>
> Always pass `min` and `max` in the right order. Consider asserting `min <= max` in development.

---

## lerp

Linear interpolation between two values by factor `t`.

```typescript
lerp(start: number, end: number, t: number): number
```

```typescript
lerp(0, 100, 0)    // 0   — t=0 returns start
lerp(0, 100, 0.5)  // 50  — midpoint
lerp(0, 100, 1)    // 100 — t=1 returns end
```

`t` is not clamped — values outside 0–1 extrapolate beyond the range:

```typescript
lerp(0, 100, 1.5)   // 150 — extrapolates beyond end
lerp(0, 100, -0.5)  // -50 — extrapolates before start
```

Common use case — smooth animation step toward a target:

```typescript
// 10% closer to target each frame
position = lerp(position, target, 0.1)
```

---

## roundTo

Rounds a number to a specified number of decimal places.

```typescript
roundTo(value: number, decimals?: number): number
```

```typescript
roundTo(1.2345, 2)   // 1.23
roundTo(1.235, 2)    // 1.24
roundTo(1.7)         // 2    — defaults to 0 decimals
roundTo(1234.5, -2)  // 1200 — negative decimals round to tens/hundreds
roundTo(-1.567, 2)   // -1.57
```

> **Floating point can cause incorrect rounding at midpoints:** `roundTo` multiplies by a power of 10 before calling `Math.round`. Due to JS floating point, some midpoint values are represented just below their expected value — `1.045 * 100 = 104.49999999999999` — and round the wrong way.
>
> ```typescript
> roundTo(1.045, 2)  // 1.04 ❌ — expected 1.05
> roundTo(1.255, 2)  // 1.25 ❌ — expected 1.26
> ```
>
> For financial values where exact midpoint rounding is critical, use `Number.EPSILON`-compensated rounding or a dedicated library. For display purposes, the error is typically invisible.

---

## truncateTo

Truncates a number to a specified number of decimal places without rounding. The result is never larger in absolute value than the input.

```typescript
truncateTo(value: number, decimals?: number): number
```

```typescript
truncateTo(5.059, 2)  // 5.05 — never rounds up
truncateTo(5.999, 2)  // 5.99
truncateTo(9.9)       // 9    — defaults to 0 decimals
```

Key difference from `roundTo`:

```typescript
roundTo(5.059, 2)    // 5.06 — rounds up
truncateTo(5.059, 2) // 5.05 — floors
```

Use `truncateTo` for financial values, win totals, or anywhere you must not overstate a value.

> **Negative numbers floor toward −∞, not toward zero:** The implementation uses `Math.floor`, which floors toward negative infinity. For negative inputs, this means the result is more negative than the input — the opposite of "toward zero".
>
> ```typescript
> truncateTo(-5.999, 2)  // -6.00 ❌ — floors to -6, not -5.99
> truncateTo(-5.059, 2)  // -5.06 ❌ — floors to -5.06, not -5.05
> ```
>
> If you need true truncation toward zero for negative numbers, use `Math.trunc` manually:
>
> ```typescript
> function truncateTowardZero(value: number, decimals: number): number {
>   const factor = Math.pow(10, decimals)
>   return Math.trunc(value * factor) / factor
> }
> ```

---

## randomInt

Returns a random integer between `min` and `max`, inclusive on both ends.

```typescript
randomInt(min: number, max: number): number
```

```typescript
randomInt(1, 6)    // dice roll — one of 1, 2, 3, 4, 5, 6
randomInt(0, 100)  // random percentage
randomInt(5, 5)    // always 5
randomInt(-10, -1) // negative range works
```

> **`min > max` returns values in an unexpected range:** The formula `Math.floor(Math.random() * (max - min + 1)) + min` produces a negative multiplier when `min > max`, giving results that are neither within `[min, max]` nor an error.
>
> ```typescript
> randomInt(10, 5)  // returns a value in [6, 9] ⚠️ — not what you'd expect
> ```

> **Float arguments produce float results:** `randomInt` doesn't validate that `min` and `max` are integers. Passing floats gives float results.
>
> ```typescript
> randomInt(1.5, 3.5)  // returns 1.5, 2.5, or 3.5 — not integers ⚠️
> ```

---

## inRange

Returns `true` if a value is between `min` and `max`, inclusive on both ends.

```typescript
inRange(value: number, min: number, max: number): boolean
```

```typescript
inRange(5, 1, 10)   // true
inRange(0, 1, 10)   // false — below min
inRange(10, 1, 10)  // true  — equal to max
inRange(5, 5, 5)    // true  — equal when min === max

if (!inRange(age, 0, 120)) throw new Error('invalid age')
if (!inRange(opacity, 0, 1)) throw new Error('invalid opacity')
```

> **`min > max` always returns `false`:** `value >= 10 && value <= 5` can never be true. No error is thrown.
>
> ```typescript
> inRange(7, 10, 5)  // false — always, even though 7 is "between" 5 and 10 ⚠️
> ```
>
> Always pass `min` before `max`.

---

## average

Returns the average (mean) of an array of numbers.

```typescript
average(arr: number[]): number
```

```typescript
average([1, 2, 3, 4, 5])  // 3
average([10, 20])          // 15
average([-10, 10])         // 0
average([])                // 0 — returns 0 for empty arrays
```

---

## normalize

Maps a value from one range to another.

```typescript
normalize(value: number, fromMin: number, fromMax: number, toMin?: number, toMax?: number): number
```

```typescript
normalize(150, 0, 200)           // 0.75 — maps to 0-1 by default
normalize(150, 0, 200, 0, 100)   // 75   — maps to 0-100
normalize(5, 0, 10, -1, 1)       // 0    — maps to -1 to 1
normalize(15, 10, 20)            // 0.5  — non-zero fromMin
```

Common use cases:

```typescript
// map mouse X position to rotation degrees
normalize(mouseX, 0, windowWidth, -45, 45)

// map a score to a progress bar width
normalize(score, 0, maxScore, 0, 100)
```

> **`fromMin === fromMax` produces `NaN`:** Division by zero when the source range is a single point.
>
> ```typescript
> normalize(5, 5, 5)  // NaN ❌
> ```
>
> Guard against this if your range bounds could be equal: `fromMin === fromMax ? toMin : normalize(...)`.

> **Values outside the source range extrapolate:** Like `lerp`, `normalize` does not clamp the output. A value outside `fromMin–fromMax` maps to a value outside `toMin–toMax`.
>
> ```typescript
> normalize(250, 0, 200, 0, 100)  // 125 — beyond toMax ⚠️
> ```
>
> Wrap with `clamp` if you need the output bounded:
>
> ```typescript
> clamp(normalize(value, fromMin, fromMax, toMin, toMax), toMin, toMax)
> ```

---

## toOrdinal

Converts a number to its ordinal string representation.

```typescript
toOrdinal(n: number): string
```

```typescript
toOrdinal(1)   // "1st"
toOrdinal(2)   // "2nd"
toOrdinal(3)   // "3rd"
toOrdinal(4)   // "4th"
toOrdinal(11)  // "11th" — not "11st"
toOrdinal(12)  // "12th" — not "12nd"
toOrdinal(13)  // "13th" — not "13rd"
toOrdinal(21)  // "21st"
toOrdinal(101) // "101st"
toOrdinal(111) // "111th"
```

Handles the 11th/12th/13th edge cases correctly.

> **Float and `NaN` inputs produce nonsense output:** No validation is performed — the modulo checks don't match floats or `NaN`, so they fall through to the default.
>
> ```typescript
> toOrdinal(1.5)  // "1.5th" ⚠️
> toOrdinal(NaN)  // "NaNth" ⚠️
> ```
>
> Only pass whole integers.

---

## toRoman

Converts a positive integer to a Roman numeral string. Supports values from 1 to 3999.

```typescript
toRoman(n: number): string
```

```typescript
toRoman(1)    // "I"
toRoman(4)    // "IV"
toRoman(9)    // "IX"
toRoman(14)   // "XIV"
toRoman(1994) // "MCMXCIV"
toRoman(2026) // "MMXXVI"
toRoman(3999) // "MMMCMXCIX"
```

Throws `RangeError` for values outside 1–3999:

```typescript
toRoman(0)     // throws RangeError
toRoman(4000)  // throws RangeError
toRoman(1.5)   // throws RangeError — floats not accepted
toRoman(-1)    // throws RangeError
```

---

## formatNumber

Formats a number with thousand separators. Supports custom separators for different locales.

```typescript
formatNumber(value: number, separator?: string, decimal?: string): string
```

```typescript
formatNumber(1000000)             // "1,000,000"
formatNumber(1234567.89)          // "1,234,567.89"
formatNumber(999)                 // "999" — no separator needed
formatNumber(-1000)               // "-1,000"
formatNumber(0)                   // "0"

// European format
formatNumber(1000, '.')           // "1.000"
formatNumber(1000.5, '.', ',')    // "1.000,5"
```

For locale-aware formatting with currency support, use the native `Intl.NumberFormat` API instead.

> **Scientific notation is not handled:** JavaScript converts numbers ≥ 1e21 to scientific notation via `String()`. The regex finds no digit groups to separate and returns the scientific notation string as-is.
>
> ```typescript
> formatNumber(1e21)   // "1e+21" ⚠️ — not "1,000,000,000,000,000,000,000"
> formatNumber(1e-7)   // "1e-7"  ⚠️
> ```
>
> If you need to format very large numbers, convert them to a fixed string first: `value.toFixed(0)` for integers.

---

## formatBytes

Formats a byte value into a human-readable string.

```typescript
formatBytes(bytes: number, decimals?: number): string
```

```typescript
formatBytes(0)           // "0 B"
formatBytes(512)         // "512 B"
formatBytes(1024)        // "1 KB"
formatBytes(1048576)     // "1 MB"
formatBytes(1073741824)  // "1 GB"
formatBytes(1234567)     // "1.18 MB"
formatBytes(1234567, 0)  // "1 MB" — 0 decimal places
```

Supports B, KB, MB, GB, TB, PB.

> **Negative bytes returns `"NaN undefined"`:** `Math.log` of a negative number is `NaN`, making the unit index `NaN` and `units[NaN]` undefined.
>
> ```typescript
> formatBytes(-1024)  // "NaN undefined" ❌
> ```

> **Values beyond PB return `"... undefined"`:** The `units` array has 6 entries (B through PB). Any value ≥ 2^60 (~1.15 exabytes) maps to index 6 or higher, which is out of bounds.
>
> ```typescript
> formatBytes(2 ** 60)  // "1 undefined" ❌
> ```
>
> If either case is possible in your app, guard with a check before calling: `bytes > 0 && bytes < 2 ** 60`.