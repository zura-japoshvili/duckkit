/**
 * Returns the item with the highest numeric value by criteria.
 *
 * If `fn` returns `NaN` for the first item, subsequent valid numbers will
 * still win — NaN never poisons the comparison.
 *
 * @param arr - The array to search
 * @param fn - Function that returns the numeric value for each item
 * @returns The item with the maximum value, or undefined if the array is empty
 *
 * @example
 * maxBy(products, x => x.price)
 * // most expensive product
 *
 * maxBy(players, x => x.score)
 * // highest scoring player
 */
export function maxBy<T>(arr: T[], fn: (item: T) => number): T | undefined {
  if (!arr.length) return undefined
  let maxItem = arr[0]!
  let maxVal = fn(maxItem)
  for (let i = 1; i < arr.length; i++) {
    const val = fn(arr[i]!)
    // Replace if val is strictly greater, OR if current maxVal is NaN
    // (any non-NaN beats NaN; without this NaN poisons the result).
    if (val > maxVal || Number.isNaN(maxVal)) {
      maxVal = val
      maxItem = arr[i]!
    }
  }
  return maxItem
}