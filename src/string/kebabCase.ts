/**
 * Converts a string to kebab-case.
 *
 * Handles camelCase, snake_case, spaces, and mixed inputs.
 *
 * @param str - The string to convert
 * @returns kebab-case version of the string
 *
 * @example
 * kebabCase('fooBarBaz')   // "foo-bar-baz"
 * kebabCase('foo_bar_baz') // "foo-bar-baz"
 * kebabCase('foo bar baz') // "foo-bar-baz"
 * kebabCase('FOOBar')      // "foo-bar"
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')
}