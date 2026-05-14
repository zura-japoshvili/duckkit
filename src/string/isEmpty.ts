/**
 * Returns `true` if the string is empty or contains only whitespace.
 *
 * @param str - The string to check
 * @returns `true` if the string is blank
 *
 * @example
 * isEmpty('')       // true
 * isEmpty('   ')    // true
 * isEmpty('\n\t')   // true
 * isEmpty('hello')  // false
 * isEmpty(' hi ')   // false
 */
export function isEmpty(str: string): boolean {
  return str.trim().length === 0
}