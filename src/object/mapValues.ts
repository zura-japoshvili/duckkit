/**
 * Creates a new object with all values transformed by `fn`. Keys are unchanged.
 *
 * Similar to `Array.map` but for object values.
 * The transformer also receives the key as a second argument.
 *
 * @param obj - The source object
 * @param fn - Function that transforms each value, receives `(value, key)`
 * @returns A new object with the same keys and transformed values
 *
 * @example
 * mapValues({ apple: 1.5, banana: 0.8 }, price => price * 0.9)
 * // { apple: 1.35, banana: 0.72 }
 *
 * @example
 * // Key is available as second argument
 * mapValues({ a: 1, b: 2 }, (value, key) => `${key}:${value}`)
 * // { a: 'a:1', b: 'b:2' }
 */
export function mapValues<T, U>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => U
): Record<string, U> {
  const result: Record<string, U> = {}
  for (const key of Object.keys(obj)) {
    result[key] = fn(obj[key] as T, key)
  }
  return result
}