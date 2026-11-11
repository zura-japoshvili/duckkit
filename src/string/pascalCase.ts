import { upperFirst } from '../_internal/case'
import { words } from './words'

/**
 * Converts a string to PascalCase.
 *
 * Handles snake_case, kebab-case, spaces, camelCase, PascalCase and mixed inputs —
 * the string is split with `words()`, so existing word boundaries are kept, in any
 * cased script. In Georgian the boundaries are marked with Mtavruli (its capital form).
 * Useful for component names, class names, and TypeScript types.
 *
 * @param str - The string to convert
 * @returns PascalCase version of the string
 *
 * @example
 * pascalCase('foo_bar_baz')  // "FooBarBaz"
 * pascalCase('foo-bar-baz')  // "FooBarBaz"
 * pascalCase('hello world')  // "HelloWorld"
 * pascalCase('fooBarBaz')    // "FooBarBaz"
 */
export function pascalCase(str: string): string {
  return words(str).map(upperFirst).join('')
}
