/**
 * Formats a number with thousand separators.
 *
 * @param value - The number to format
 * @param separator - Thousand separator (default: ',')
 * @param decimal - Decimal separator (default: '.')
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1000000)        // "1,000,000"
 * formatNumber(1234567.89)     // "1,234,567.89"
 * formatNumber(1000, '.')      // "1.000"
 * formatNumber(1000.5, '.', ',') // "1.000,5"
 */
export function formatNumber(
  value: number,
  separator: string = ',',
  decimal: string = '.'
): string {
  const [intPart, decPart] = String(value).split('.')
  const formatted = intPart!.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  return decPart !== undefined ? `${formatted}${decimal}${decPart}` : formatted
}