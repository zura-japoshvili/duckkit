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
  let minItem = arr[0]!
  let minVal = fn(minItem)
  for (let i = 1; i < arr.length; i++) {
    const val = fn(arr[i]!)
    if (val < minVal) { minVal = val; minItem = arr[i]! }
  }
  return minItem
}