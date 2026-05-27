/**
 * Creates a new object with only the specified keys.
 *
 * Returns `Pick<T, K>` — TypeScript removes all other keys from the type.
 * Only own properties are picked. Inherited keys are skipped.
 *
 * @param obj - The source object
 * @param keys - Keys to keep
 * @returns A new object containing only the picked keys
 *
 * @example
 * const user = { name: 'Zura', email: 'z@z.com', password: 'secret' }
 * pick(user, ['name', 'email'])
 * // { name: 'Zura', email: 'z@z.com' }
 * // type: { name: string, email: string } — password gone from type ✅
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key]
    }
  }
  return result
}