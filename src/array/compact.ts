/**
 * Removes all falsy values from an array.
 *
 * Unlike `arr.filter(Boolean)`, this properly narrows the type —
 * `null`, `undefined`, `false`, `0`, and `""` are removed,
 * and the return type reflects that.
 *
 * @param arr - The array to compact
 * @returns New array with all falsy values removed
 *
 * @example
 * compact([1, null, 2, undefined, 3, false, 0, ''])
 * // [1, 2, 3]
 *
 * @example
 * compact(users.map(u => u.email))
 * // string[] — nulls removed, type narrowed ✅
 */
export function compact<T>(arr: (T | null | undefined | false | 0 | '')[]): T[] {
  return arr.filter((item): item is T => Boolean(item))
}