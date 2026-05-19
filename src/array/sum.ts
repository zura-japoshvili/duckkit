/**
 * Returns the sum of all numbers in an array.
 *
 * @param arr - Array of numbers
 * @returns Sum of all values, or 0 for empty arrays
 *
 * @example
 * sum([1, 2, 3, 4, 5])
 * // 15
 */
export function sum(arr: number[]): number {
  return arr.reduce((acc, n) => acc + n, 0)
}

/**
 * Returns the sum of a numeric field across all items.
 *
 * @param arr - The array to sum over
 * @param fn - Function that returns the numeric value for each item
 * @returns Sum of all values, or 0 for empty arrays
 *
 * @example
 * sumBy(orders, x => x.total)
 * // total revenue
 *
 * @example
 * sumBy(cart, x => x.price * x.quantity)
 * // cart total
 */
export function sumBy<T>(arr: T[], fn: (item: T) => number): number {
  return arr.reduce((acc, item) => acc + fn(item), 0)
}