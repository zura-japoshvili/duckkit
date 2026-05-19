/**
 * Converts an array into an object keyed by a derived value.
 *
 * Useful for turning a list into a lookup map — O(1) access by key
 * instead of O(n) `.find()` every time.
 *
 * @param arr - The array to index
 * @param fn - Function that returns the key for each item
 * @returns Record mapping each key to its item
 *
 * @example
 * keyBy(users, x => x.id)
 * // { '1': { id: '1', name: 'Zura' }, '2': { id: '2', name: 'Alice' } }
 *
 * @example
 * const byId = keyBy(products, x => x.id)
 * byId['abc123']  // instant lookup ✅
 */
export function keyBy<T>(arr: T[], fn: (item: T) => string): Record<string, T> {
  const result: Record<string, T> = {}
  for (const item of arr) {
    result[fn(item)] = item
  }
  return result
}