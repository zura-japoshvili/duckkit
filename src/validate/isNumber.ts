/**
 * Returns `true` if the value is a number and not NaN.
 * Narrows the type to `number` in TypeScript.
 *
 * @param value - The value to check
 * @returns `true` if number and not NaN, `false` otherwise
 *
 * @example
 * isNumber(42)    // true
 * isNumber(3.14)  // true
 * isNumber(0)     // true
 * isNumber(NaN)   // false — NaN is not a valid number
 * isNumber('42')  // false
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}