/**
 * Counts how many times a substring appears in a string.
 *
 * Case-sensitive. Counts non-overlapping occurrences.
 *
 * @param str - The string to search in
 * @param substring - The substring to count
 * @returns Number of non-overlapping occurrences
 *
 * @example
 * countOccurrences('hello world hello', 'hello') // 2
 * countOccurrences('aaa', 'aa')                  // 1  (non-overlapping)
 * countOccurrences('hello', 'xyz')               // 0
 */
export function countOccurrences(str: string, substring: string): number {
  if (substring.length === 0) return 0
  return str.split(substring).length - 1
}