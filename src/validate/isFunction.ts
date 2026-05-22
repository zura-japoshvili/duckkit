/**
 * Returns `true` if the value is a function.
 * Narrows the type to `Function` in TypeScript.
 *
 * @param value - The value to check
 * @returns `true` if function, `false` otherwise
 *
 * @example
 * isFunction(() => {})          // true
 * isFunction(function fn() {})  // true
 * isFunction({})                // false
 * isFunction(null)              // false
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}