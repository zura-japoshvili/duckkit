/**
 * Converts a string to Title Case, capitalizing the first letter of every word.
 *
 * @param str - The string to convert
 * @returns Title Case version of the string
 *
 * @example
 * titleCase('hello world')          // "Hello World"
 * titleCase('the lord of the rings') // "The Lord Of The Rings"
 * titleCase('foo_bar baz')          // "Foo_bar Baz"
 */
export function titleCase(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase())
}