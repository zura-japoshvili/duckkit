import { hasOwnKey, setOwn } from '../_internal/own'

/**
 * Groups array items by a key returned from `fn`.
 *
 * Returns `Partial<Record<K, T[]>>` — only keys that actually appear in
 * the input are present at runtime, so accessing a missing key gives
 * `undefined` rather than an empty array. The type forces you to guard
 * with `?.` or `??`.
 *
 * @param arr - The array to group
 * @param fn - Function that returns the group key for each item
 * @returns A record mapping each key to its items
 *
 * @example
 * const users = [{ name: 'Zura', country: 'GE' }, { name: 'Alice', country: 'US' }]
 * groupBy(users, x => x.country)
 * // { GE: [{ name: 'Zura', ... }], US: [{ name: 'Alice', ... }] }
 *
 * @example
 * // Accessing absent keys is safe with optional chaining
 * const grouped = groupBy(users, x => x.status as 'active' | 'banned')
 * grouped.banned?.length ?? 0
 */
export function groupBy<T, K extends string>(
  arr: T[],
  fn: (item: T) => K
): Partial<Record<K, T[]>> {
  const result = {} as Partial<Record<K, T[]>>
  for (const item of arr) {
    const key = fn(item)
    if (hasOwnKey(result, key)) result[key]!.push(item)
    else setOwn(result, key, [item])
  }
  return result
}