/**
 * Converts a string into a lowercase, hyphen-separated slug.
 *
 * Letters and digits from every script are kept (Georgian, Cyrillic, CJK, …);
 * accents on Latin letters are removed (`Café` → `cafe`). Everything else —
 * punctuation, symbols, fractions, emoji — is dropped, and runs of spaces,
 * underscores and hyphens become a single hyphen.
 *
 * Non-Latin slugs are valid in URLs (browsers show them as typed and send them
 * percent-encoded). Transliterate first if you need ASCII-only slugs.
 *
 * @param str - The string to slugify
 * @returns A lowercase hyphen-separated slug
 *
 * @example
 * slugify('Hello World!')       // "hello-world"
 * slugify('My Blog Post #1')    // "my-blog-post-1"
 * slugify('  extra   spaces  ') // "extra-spaces"
 * slugify('Café Résumé')        // "cafe-resume"
 * slugify('Duckkit™ Pro')       // "duckkit-pro"
 * slugify('Tom & Jerry')        // "tom-jerry"
 */
export function slugify(str: string): string {
  return (
    str
      // Drop symbols first — decomposing them would spell them out (™ → "TM", ½ → "1⁄2")
      .replace(/[^\p{L}\p{M}\p{Nd}\s_-]+/gu, '')
      // Compatibility forms become plain ones (ﬁ → fi, Ａ → A, １ → 1), é becomes e + ◌́
      .normalize('NFKD')
      // Lowercase after decomposing, which can produce capitals (ǅ → Dž)
      .toLowerCase()
      // Accents on Latin letters: e + ◌́ → e
      .replace(/(\p{Script=Latin})\p{M}+/gu, '$1')
      .normalize('NFC')
      // Marks only belong after letters (Hindi vowel signs, Japanese dakuten);
      // drop the rest, e.g. emoji variation selectors and keycap marks
      .replace(/(^|[^\p{L}\p{M}])\p{M}+/gu, '$1')
      .replace(/[^\p{L}\p{M}\p{Nd}\s_-]+/gu, '')
      .replace(/[\s_-]+/gu, '-')
      .replace(/^-+|-+$/g, '')
  )
}
