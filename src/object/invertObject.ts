/**
 * Flips the keys and values of an object.
 *
 * If multiple keys have the same value, the last one wins.
 *
 * @param obj - The object to invert
 * @returns A new object with keys and values swapped
 *
 * @example
 * invertObject({ a: 1, b: 2, c: 3 })
 * // { 1: 'a', 2: 'b', 3: 'c' }
 *
 * @example
 * invertObject({ admin: 'ROLE_ADMIN', user: 'ROLE_USER' })
 * // { ROLE_ADMIN: 'admin', ROLE_USER: 'user' }
 */
export function invertObject<K extends string, V extends string>(
  obj: Record<K, V>
): Record<V, K> {
  const result = {} as Record<V, K>
  for (const key of Object.keys(obj) as K[]) {
    result[obj[key]] = key
  }
  return result
}