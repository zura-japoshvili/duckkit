/**
 * Converts a string to snake_case.
 *
 * Handles camelCase, kebab-case, spaces, and mixed inputs.
 *
 * @param str - The string to convert
 * @returns snake_case version of the string
 *
 * @example
 * snakeCase('fooBarBaz')   // "foo_bar_baz"
 * snakeCase('foo-bar-baz') // "foo_bar_baz"
 * snakeCase('foo bar baz') // "foo_bar_baz"
 * snakeCase('FOOBar')      // "foo_bar"
 */
export function snakeCase(str: string): string {
  return str
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, '$1_$2')
    .replace(/([\p{Ll}\d])(\p{Lu})/gu, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase()
    .replace(/^_+|_+$/g, '')
}