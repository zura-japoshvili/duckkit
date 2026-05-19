/**
 * Typed version of `Object.keys`.
 *
 * Native `Object.keys` returns `string[]`, losing the literal key types.
 * This returns `(keyof T)[]` so you get the actual keys.
 *
 * @param obj - The source object
 * @returns Array of keys typed as `(keyof T)[]`
 *
 * @example
 * keys({ name: 'Zura', age: 25 })
 * // typed as ('name' | 'age')[] instead of string[]
 */
export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

/**
 * Typed version of `Object.values`.
 *
 * @param obj - The source object
 * @returns Array of values
 *
 * @example
 * values({ name: 'Zura', age: 25 })
 * // ['Zura', 25]
 */
export function values<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][]
}

/**
 * Typed version of `Object.entries`.
 *
 * Native `Object.entries` returns `[string, T][]`, losing key literal types.
 * This returns `[keyof T, T[keyof T]][]`.
 *
 * @param obj - The source object
 * @returns Array of `[key, value]` pairs with proper types
 *
 * @example
 * entries({ name: 'Zura', age: 25 })
 * // typed as ['name' | 'age', string | number][]
 */
export function entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

/**
 * Typed version of `Object.fromEntries`.
 *
 * Native `Object.fromEntries` returns `Record<string, T>` losing key types.
 *
 * @param entries - Array of `[key, value]` pairs
 * @returns Object built from the entries
 *
 * @example
 * fromEntries([['name', 'Zura'], ['age', 25]])
 * // { name: 'Zura', age: 25 }
 */
export function fromEntries<K extends string, V>(entries: [K, V][]): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>
}