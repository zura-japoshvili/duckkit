/**
 * Truncates a number to a specified number of decimal places without rounding.
 *
 * Unlike `roundTo`, this always floors toward zero — the result is never
 * larger than the input. Useful anywhere you must not overpromise a value,
 * like financial amounts, win totals, or display prices.
 *
 * @param value - The number to truncate
 * @param decimals - Number of decimal places (default: 0)
 * @returns The truncated number
 *
 * @example
 * truncateTo(5.059, 2)  // 5.05  (roundTo would give 5.06)
 * truncateTo(5.999, 2)  // 5.99  (roundTo would give 6.00)
 * truncateTo(1.005, 2)  // 1.00
 * truncateTo(9.9)       // 9
 */
export function truncateTo(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals)
  const epsilon = 1e-9
  return Math.floor(value * factor + epsilon) / factor
}