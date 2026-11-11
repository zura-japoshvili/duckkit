import { upperFirstChar } from '../_internal/case'

// A letter starts a word when it comes first, or after a character that is not part of a
// word, or after opening quotes ('quick'). An apostrophe right after a letter (don't) is
// inside the word, so the letter after it is not capitalized.
const WORD_START = /(^|[^\p{L}\p{M}\p{N}_'’]|(?:^|[^\p{L}\p{M}\p{N}_])['’]+)(\p{L})/gu

/**
 * Converts a string to Title Case, capitalizing the first letter of every word.
 *
 * Works for any script with upper and lower case (`élan` → `Élan`).
 * Apostrophes and underscores stay inside a word (`don't` → `Don't`); words in
 * single quotes are capitalized (`'quick'` → `'Quick'`). Existing capitals are kept,
 * not lowercased. Georgian is left unchanged: its capital forms (Mtavruli) are only
 * used for all-caps text, never to start a word.
 *
 * @param str - The string to convert
 * @returns Title Case version of the string
 *
 * @example
 * titleCase('hello world')          // "Hello World"
 * titleCase('the lord of the rings') // "The Lord Of The Rings"
 * titleCase("don't stop")           // "Don't Stop"
 * titleCase("the 'quick' fox")      // "The 'Quick' Fox"
 * titleCase('foo_bar baz')          // "Foo_bar Baz"
 */
export function titleCase(str: string): string {
  return str.replace(WORD_START, (_, before: string, letter: string) => before + upperFirstChar(letter))
}
