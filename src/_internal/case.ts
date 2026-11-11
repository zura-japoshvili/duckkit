/**
 * Internal helpers — not exported from the package.
 */

const GEORGIAN = /\p{Script=Georgian}/u

/**
 * Uppercases a character that starts a word in prose (`capitalize`, `titleCase`).
 *
 * Georgian is returned unchanged: `'ა'.toUpperCase()` gives Mtavruli (`'Ა'`),
 * which Georgian uses only for all-caps text, never to start a word.
 */
export function upperFirstChar(char: string): string {
  return GEORGIAN.test(char) ? char : char.toUpperCase()
}

/**
 * Uppercases the first character of a word (by code point, so emoji stay whole),
 * with no script exceptions. Used for identifiers (`camelCase`, `pascalCase`), where the
 * capital marks a word boundary — in Georgian that is Mtavruli, the only capital it has.
 */
export function upperFirst(word: string): string {
  const [first = ''] = word
  return first.toUpperCase() + word.slice(first.length)
}
