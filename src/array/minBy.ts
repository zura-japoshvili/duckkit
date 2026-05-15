/**
 * Returns the item with the lowest numeric value by criteria.
 *
 * @param arr - The array to search
 * @param fn - Function that returns the numeric value for each item
 * @returns The item with the minimum value, or undefined if array is empty
 *
 * @example
 * minBy(products, x => x.price)
 * // cheapest product
 *
 * minBy(players, x => x.score)
 * // lowest scoring player
 */
export function minBy<T>(arr: T[], fn: (item: T) => number): T | undefined {
  if (arr.length === 0) return undefined
  return arr.reduce((min, item) => fn(item) < fn(min) ? item : min)
}