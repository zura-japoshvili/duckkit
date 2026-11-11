import { setOwn } from '../_internal/own'

/**
 * Shallow merge that skips keys where the override value is `null` or `undefined`.
 * Base values are preserved when the override has nothing meaningful to contribute.
 * Non-mutating. Nested objects are replaced, not merged — use `deepMerge` for that.
 *
 * @param base - The object to start from
 * @param override - Values to apply; `null` and `undefined` values are ignored
 * @returns A new object
 *
 * @example
 * mergeIf({ name: 'Zura', role: 'admin' }, { name: 'Zurab', role: undefined })
 * // { name: 'Zurab', role: 'admin' } — role preserved ✅
 *
 * @example
 * // form values where empty fields come back as null
 * mergeIf(savedSettings, { theme: form.theme ?? null, lang: null })
 */
export function mergeIf<T extends Record<string, unknown>>(
  base: T,
  override: { [K in keyof T]?: T[K] | null | undefined }
): T {
  const result = { ...base }
  for (const key of Object.keys(override)) {
    const val = override[key as keyof T]
    if (val !== undefined && val !== null) {
      setOwn(result, key, val)
    }
  }
  return result
}
