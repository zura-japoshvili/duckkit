import { assertDecimals, atDecimals } from '../_internal/decimal'

/**
 * Cuts a number down to a specified number of decimal places without rounding up.
 *
 * Always floors toward -Infinity, so the result is never larger than the input
 * (`-5.059` becomes `-5.06`). Useful anywhere you must not overpromise a value,
 * like financial amounts, win totals, or display prices.
 *
 * Works on the decimal number you wrote, not its binary approximation:
 * `truncateTo(0.29, 2)` is `0.29` and `truncateTo(1.999999999999, 2)` is `1.99`.
 *
 * @param value - The number to truncate
 * @param decimals - Number of decimal places (default: 0). Negative values cut to tens, hundreds, …
 * @returns The truncated number. `NaN` and `±Infinity` are returned unchanged.
 * @throws If `decimals` is not an integer
 *
 * @example
 * truncateTo(5.059, 2)  // 5.05  (roundTo would give 5.06)
 * truncateTo(5.999, 2)  // 5.99  (roundTo would give 6.00)
 * truncateTo(1.005, 2)  // 1.00
 * truncateTo(9.9)       // 9
 * truncateTo(-5.059, 2) // -5.06 (never larger than the input)
 */
export function truncateTo(value: number, decimals: number = 0): number {
  assertDecimals('truncateTo', decimals)
  return atDecimals(value, decimals, Math.floor)
}
