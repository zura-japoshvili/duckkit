/**
 * Returns the keys that differ between two objects.
 * A key is included if it was added, removed, or its value changed
 * (shallow comparison — nested objects compared by reference).
 *
 * @example
 * objectDiff({ a: 1, b: 2 }, { a: 1, b: 3, c: 4 })
 * // ['b', 'c'] — b changed, c was added
 */
export function objectDiff<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>
>(base: T, updated: U): string[] {
  const allKeys = new Set([...Object.keys(base), ...Object.keys(updated)])
  const changed: string[] = []
  for (const key of allKeys) {
    if (base[key] !== updated[key]) changed.push(key)
  }
  return changed
}