/**
 * Converts a string to camelCase.
 *
 * Handles snake_case, kebab-case, spaces, and mixed inputs.
 *
 * @param str - The string to convert
 * @returns camelCase version of the string
 *
 * @example
 * camelCase('foo_bar_baz')   // "fooBarBaz"
 * camelCase('foo-bar-baz')   // "fooBarBaz"
 * camelCase('foo bar baz')   // "fooBarBaz"
 * camelCase('FOO_BAR')       // "fooBar"
 */
export function camelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)/g, (_, char: string) => char.toUpperCase())
}