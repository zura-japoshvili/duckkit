/**
 * Creates a new object with the specified keys removed.
 *
 * Returns `Omit<T, K>` — TypeScript removes the omitted keys from the type entirely.
 * Accessing an omitted key after this call is a compile-time error.
 *
 * @param obj - The source object
 * @param keys - Keys to remove
 * @returns A new object without the omitted keys
 *
 * @example
 * const user = { name: 'Zura', email: 'z@z.com', password: 'secret' }
 * omit(user, ['password'])
 * // { name: 'Zura', email: 'z@z.com' }
 * // result.password → TypeScript error ✅
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result as Omit<T, K>
}