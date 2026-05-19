/**
 * Converts a number to its ordinal string representation.
 *
 * @param n - The number to convert
 * @returns The ordinal string
 *
 * @example
 * toOrdinal(1)  // "1st"
 * toOrdinal(2)  // "2nd"
 * toOrdinal(3)  // "3rd"
 * toOrdinal(4)  // "4th"
 * toOrdinal(11) // "11th"
 * toOrdinal(21) // "21st"
 */
export function toOrdinal(n: number): string {
  const abs = Math.abs(n)
  const mod100 = abs % 100
  const mod10 = abs % 10

  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  if (mod10 === 1) return `${n}st`
  if (mod10 === 2) return `${n}nd`
  if (mod10 === 3) return `${n}rd`
  return `${n}th`
}