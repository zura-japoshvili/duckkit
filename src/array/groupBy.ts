/**
 * Groups array items by a key returned from `fn`.
 *
 * Instead of `Dictionary<T[]>` (which is essentially `any`), this returns a properly typed `Record<K, T[]>`  .
 * If `fn` returns a literal union, TypeScript will infer all possible keys.
 *
 * @param arr - The array to group
 * @param fn - Function that returns the group key for each item
 * @returns A record mapping each key to its items
 *
 * @example
 * const users = [{ name: 'Zura', country: 'GE' }, { name: 'Alice', country: 'US' }]
 * groupBy(users, x => x.country)
 * // { GE: [{ name: 'Zura', ... }], US: [{ name: 'Alice', ... }] }
 */
export function groupBy<T, K extends string>(
  arr: T[],
  fn: (item: T) => K
): Record<K, T[]> {
  const result = {} as Record<K, T[]>
  for (const item of arr) {
    const key = fn(item)
    if (!result[key]) {
      result[key] = []
    }
    result[key].push(item)
  }
  return result
}