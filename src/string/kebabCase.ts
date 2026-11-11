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
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, '$1-$2')
    .replace(/([\p{Ll}\d])(\p{Lu})/gu, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')
}