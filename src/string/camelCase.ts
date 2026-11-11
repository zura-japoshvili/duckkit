import { upperFirst } from '../_internal/case'
import { words } from './words'

/**
 * Converts a string to camelCase.
 *
 * Handles snake_case, kebab-case, spaces, camelCase, PascalCase and mixed inputs —
 * the string is split with `words()`, so existing word boundaries are kept, in any
 * cased script. In Georgian the boundary is marked with Mtavruli (its capital form).
 *
 * @param str - The string to convert
 * @returns camelCase version of the string
 *
 * @example
 * camelCase('foo_bar_baz')   // "fooBarBaz"
 * camelCase('foo-bar-baz')   // "fooBarBaz"
 * camelCase('foo bar baz')   // "fooBarBaz"
 * camelCase('FOO_BAR')       // "fooBar"
 * camelCase('fooBar')        // "fooBar"
 * camelCase('myAPIKey')      // "myApiKey"
 */
export function camelCase(str: string): string {
  return words(str)
    .map((word, i) => (i === 0 ? word : upperFirst(word)))
    .join('')
}
