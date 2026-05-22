/**
 * Returns `true` if the value is a valid credit card number.
 * Uses the Luhn algorithm. Accepts spaces and dashes between digits.
 *
 * @param value - The string to check
 * @returns `true` if valid credit card number, `false` otherwise
 *
 * @example
 * isCreditCard('4242424242424242')     // true — Visa test number
 * isCreditCard('4242 4242 4242 4242')  // true — spaces allowed
 * isCreditCard('1234567890123456')     // false — fails Luhn
 */
export function isCreditCard(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0
  let shouldDouble = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]!)
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }
  return sum % 10 === 0
}