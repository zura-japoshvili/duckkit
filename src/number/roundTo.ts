/**
 * Rounds a number to a specified number of decimal places.
 *
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 0)
 * @returns The rounded number
 *
 * @example
 * roundTo(1.2345, 2)  // 1.23
 * roundTo(1.235, 2)   // 1.24
 * roundTo(3.14159, 2) // 3.14
 * roundTo(1234.5, -2) // 1200
 * roundTo(1.7)        // 2
 *
 * @remarks
 * Subject to floating-point representation error at some midpoints — e.g.
 * `roundTo(1.005, 2)` is `1.00` (not `1.01`) because `1.005 * 100` is stored
 * as `100.4999…`. See docs/number.md for details.
 */
export function roundTo(value: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}