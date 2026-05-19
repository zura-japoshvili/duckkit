/**
 * Returns the average (mean) of an array of numbers.
 *
 * @param arr - Array of numbers
 * @returns The average value, or 0 for empty arrays
 *
 * @example
 * average([1, 2, 3, 4, 5]) // 3
 * average([10, 20])        // 15
 * average([])              // 0
 */
export function average(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((sum, n) => sum + n, 0) / arr.length
}