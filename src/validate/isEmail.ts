/**
 * Returns `true` if the value is a valid email address.
 *
 * @param value - The string to check
 * @returns `true` if valid email, `false` otherwise
 *
 * @example
 * isEmail('z@z.com')         // true
 * isEmail('user@mail.co.uk') // true
 * isEmail('notanemail')      // false
 * isEmail('z@')              // false
 */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}