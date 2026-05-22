/**
 * Returns `true` if the value is a valid Date instance.
 * Returns `false` for Invalid Date.
 * Narrows the type to `Date` in TypeScript.
 *
 * @param value - The value to check
 * @returns `true` if valid Date, `false` otherwise
 *
 * @example
 * isDate(new Date())           // true
 * isDate(new Date('invalid'))  // false — Invalid Date
 * isDate('2026-01-01')         // false — string
 * isDate(Date.now())           // false — number
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}