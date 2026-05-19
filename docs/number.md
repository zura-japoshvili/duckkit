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

---

## truncateTo

Truncates a number to a specified number of decimal places without rounding. Always floors toward zero — the result is never larger than the input.

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
toRoman(-1)    // throws RangeError
```

---

## formatNumber

Formats a number with thousand separators. Supports custom separators for different locales.

```typescript
formatNumber(value: number, separator?: string, decimal?: string): string
```

```typescript
formatNumber(1000000)            // "1,000,000"
formatNumber(1234567.89)         // "1,234,567.89"
formatNumber(999)                // "999" — no separator needed
formatNumber(-1000)              // "-1,000"
formatNumber(0)                  // "0"

// European format
formatNumber(1000, '.')          // "1.000"
formatNumber(1000.5, '.', ',')   // "1.000,5"
```

For locale-aware formatting with currency support, use the native `Intl.NumberFormat` API instead.

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