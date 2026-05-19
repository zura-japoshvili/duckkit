/**
 * Creates a new object keeping only keys that pass the predicate.
 *
 * Like `pick` but with a function instead of a fixed array of keys.
 * Useful when you don't know the keys upfront.
 *
 * @param obj - The source object
 * @param predicate - Function that returns true for keys to keep
 * @returns A new object with only the matching keys
 *
 * @example
 * filterKeys({ _id: 1, name: 'Zura', _internal: true }, k => !k.startsWith('_'))
 * // { name: 'Zura' }
 *
 * @example
 * filterKeys(config, k => allowedKeys.includes(k))
 */
export function filterKeys<T>(
  obj: Record<string, T>,
  predicate: (key: string) => boolean
): Record<string, T> {
  const result: Record<string, T> = {}
  for (const key of Object.keys(obj)) {
    if (predicate(key)) result[key] = obj[key] as T
  }
  return result
}