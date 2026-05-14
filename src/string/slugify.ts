/**
 * Converts a string into a URL-safe slug.
 *
 * Lowercases, replaces spaces and special characters with hyphens,
 * and removes any remaining non-alphanumeric characters.
 *
 * @param str - The string to slugify
 * @returns A lowercase hyphen-separated slug
 *
 * @example
 * slugify('Hello World!')       // "hello-world"
 * slugify('My Blog Post #1')    // "my-blog-post-1"
 * slugify('  extra   spaces  ') // "extra-spaces"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}