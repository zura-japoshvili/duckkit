/**
 * Like `deepMerge` but skips keys where the override value is `null` or `undefined`.
 * Base values are preserved when the override has nothing meaningful to contribute.
 *
 * @example
 * mergeIf({ name: 'Zura', role: 'admin' }, { role: undefined, age: 25 })
 * // { name: 'Zura', role: 'admin', age: 25 } — role preserved ✅
 */
export function mergeIf<T extends Record<string, unknown>>(
  base: T,
  override: Partial<T>
): T {
  const result = { ...base }
  for (const key of Object.keys(override)) {
    const val = override[key as keyof T]
    if (val !== undefined && val !== null) {
      (result as Record<string, unknown>)[key] = val
    }
  }
  return result
}