/**
 * Recursively merges two objects. Nested objects are merged, not replaced.
 * Arrays and primitives in `override` always win.
 *
 * The return type is a deep merge of `T` and `U` — fully typed,
 * no `any` anywhere.
 *
 * @param base - The base object
 * @param override - Values to merge in (takes priority on conflicts)
 * @returns A new deeply merged object typed as `DeepMerge<T, U>`
 *
 * @example
 * deepMerge(
 *   { theme: { color: 'red', size: 12 }, debug: false },
 *   { theme: { color: 'blue' } }
 * )
 * // { theme: { color: 'blue', size: 12 }, debug: false }
 *
 * @example
 * // Arrays are replaced, not merged
 * deepMerge({ tags: [1, 2] }, { tags: [3] })
 * // { tags: [3] }
 */
type DeepMerge<T, U> = {
  [K in keyof T | keyof U]: K extends keyof U
    ? K extends keyof T
      ? T[K] extends object
        ? U[K] extends object
          ? DeepMerge<T[K], U[K]>
          : U[K]
        : U[K]
      : U[K]
    : K extends keyof T
    ? T[K]
    : never
}

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

export function deepMerge<T extends object, U extends object>(
  base: T,
  override: U
): DeepMerge<T, U> {
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) }

  for (const key of Object.keys(override) as (keyof U)[]) {
    const overrideVal = override[key]
    const baseVal = result[key as string]

    if (isPlainObject(overrideVal) && isPlainObject(baseVal)) {
      result[key as string] = deepMerge(baseVal, overrideVal)
    } else {
      result[key as string] = overrideVal
    }
  }

  return result as DeepMerge<T, U>
}