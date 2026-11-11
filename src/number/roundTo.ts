import { assertDecimals, atDecimals } from '../_internal/decimal'

/**
 * Rounds a number to a specified number of decimal places.
 *
 * Rounds the decimal number you wrote, not its binary approximation:
 * `roundTo(1.005, 2)` is `1.01`, where the common `Math.round(x * 100) / 100`
 * gives `1`. Halves round toward +Infinity, like `Math.round`.
 *
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 0). Negative values round to tens, hundreds, …
 * @returns The rounded number. `NaN` and `±Infinity` are returned unchanged.
 * @throws If `decimals` is not an integer
 *
 * @example
 * roundTo(1.2345, 2)  // 1.23
 * roundTo(1.235, 2)   // 1.24
 * roundTo(1.005, 2)   // 1.01
 * roundTo(3.14159, 2) // 3.14
 * roundTo(1234.5, -2) // 1200
 * roundTo(1.7)        // 2
 * roundTo(-2.5)       // -2 (halves go toward +Infinity)
 */
export function roundTo(value: number, decimals: number = 0): number {
  assertDecimals('roundTo', decimals)
  return atDecimals(value, decimals, Math.round)
}
