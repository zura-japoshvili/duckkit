/**
 * Splits a string into an array of words.
 *
 * Handles camelCase, snake_case, kebab-case, spaces, and mixed inputs.
 * Useful as a building block for case conversion utilities.
 *
 * @param str - The string to split
 * @returns Array of lowercase words
 *
 * @example
 * words('fooBarBaz')    // ["foo", "bar", "baz"]
 * words('foo_bar_baz')  // ["foo", "bar", "baz"]
 * words('foo-bar-baz')  // ["foo", "bar", "baz"]
 * words('FOOBar')       // ["foo", "bar"]
 * words('hello world')  // ["hello", "world"]
 */
export function words(str: string): string[] {
  return str
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}