/**
 * Returns `true` if the value is a plausible phone number.
 * Accepts +, spaces, dashes, and parentheses. Requires at least 7 digits.
 *
 * @param value - The string to check
 * @returns `true` if plausible phone number, `false` otherwise
 *
 * @example
 * isPhone('+1 (555) 123-4567')  // true
 * isPhone('555-123-4567')       // true
 * isPhone('5551234567')         // true
 * isPhone('abc')                // false
 * isPhone('123')                // false — too short
 */
export function isPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return /^[+\d][\d\s\-().]{6,}$/.test(value) && digits.length >= 7
}