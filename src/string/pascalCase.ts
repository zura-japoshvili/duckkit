/**
 * Converts a string to PascalCase.
 *
 * Handles snake_case, kebab-case, spaces, and mixed inputs.
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
  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)/g, (_, char: string) => char.toUpperCase())
    .replace(/^(.)/, (char: string) => char.toUpperCase())
}