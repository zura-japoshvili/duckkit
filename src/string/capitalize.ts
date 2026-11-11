import { upperFirstChar } from '../_internal/case'

/**
 * Capitalizes the first letter of a string. Rest of the string is unchanged.
 *
 * Emoji and other characters outside the Basic Multilingual Plane are kept
 * whole. Georgian is left unchanged — its capital forms (Mtavruli) are only
 * used for all-caps text, never to start a word.
 *
 * @param str - The string to capitalize
 * @returns The string with the first character uppercased
 *
 * @example
 * capitalize('hello world') // "Hello world"
 * capitalize('javaScript')  // "JavaScript"
 * capitalize('😀hello')     // "😀hello"
 * capitalize('')            // ""
 */
export function capitalize(str: string): string {
  // Destructuring a string iterates by code point, so an emoji stays one character
  const [first = ''] = str
  return upperFirstChar(first) + str.slice(first.length)
}
