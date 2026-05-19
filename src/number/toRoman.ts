/**
 * Converts a positive integer to a Roman numeral string.
 *
 * Supports values from 1 to 3999.
 * Throws for values outside this range.
 *
 * @param n - The number to convert (1–3999)
 * @returns The Roman numeral string
 *
 * @example
 * toRoman(1)    // "I"
 * toRoman(4)    // "IV"
 * toRoman(14)   // "XIV"
 * toRoman(1994) // "MCMXCIV"
 * toRoman(2026) // "MMXXVI"
 */
export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 3999) {
    throw new RangeError('toRoman: value must be an integer between 1 and 3999')
  }

  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']

  let result = ''
  let remaining = n

  for (let i = 0; i < values.length; i++) {
    while (remaining >= values[i]!) {
      result += symbols[i]
      remaining -= values[i]!
    }
  }

  return result
}