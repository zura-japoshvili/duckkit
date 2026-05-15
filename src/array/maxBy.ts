/**
 * Returns the item with the highest numeric value by criteria.
 *
 * @param arr - The array to search
 * @param fn - Function that returns the numeric value for each item
 * @returns The item with the maximum value, or undefined if array is empty
 *
 * @example
 * maxBy(products, x => x.price)
 * // most expensive product
 *
 * maxBy(players, x => x.score)
 * // highest scoring player
 */
export function maxBy<T>(arr: T[], fn: (item: T) => number): T | undefined {
  if (arr.length === 0) return undefined
  return arr.reduce((max, item) => fn(item) > fn(max) ? item : max)
}