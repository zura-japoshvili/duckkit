/**
 * Capitalizes the first letter of a string. Rest of the string is unchanged.
 *
 * @param str - The string to capitalize
 * @returns The string with the first character uppercased
 *
 * @example
 * capitalize('hello world') // "Hello world"
 * capitalize('javaScript')  // "JavaScript"
 * capitalize('')            // ""
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}