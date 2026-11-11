/**
 * Internal helpers — not exported from the package.
 */

interface GraphemeSegmenter {
  segment(input: string): Iterable<{ segment: string }>
}
type SegmenterConstructor = new (locales?: string, options?: { granularity: 'grapheme' }) => GraphemeSegmenter

let cached: GraphemeSegmenter | undefined

/** `Intl.Segmenter` for user-perceived characters, or undefined where it doesn't exist. */
function graphemeSegmenter(): GraphemeSegmenter | undefined {
  const Segmenter = (Intl as unknown as { Segmenter?: SegmenterConstructor }).Segmenter
  if (typeof Segmenter !== 'function') return undefined
  cached ??= new Segmenter(undefined, { granularity: 'grapheme' })
  return cached
}

/**
 * Returns the longest start of `str` that is at most `max` long (measured like
 * `str.length`) without cutting a character in half.
 *
 * With `Intl.Segmenter` (every current browser, Node.js 16+), whole user-perceived
 * characters are kept: emoji with skin tones or ZWJ (👨‍👩‍👧), flags (🇬🇪) and letters
 * with combining accents. Without it, at least a surrogate pair (😀) is never split.
 */
export function cutAt(str: string, max: number): string {
  if (!(max > 0)) return ''
  if (str.length <= max) return str

  const segmenter = graphemeSegmenter()
  if (segmenter) {
    let end = 0
    for (const { segment } of segmenter.segment(str)) {
      if (end + segment.length > max) break
      end += segment.length
    }
    return str.slice(0, end)
  }

  const end = Math.floor(max)
  const last = str.charCodeAt(end - 1)
  const endsInHighSurrogate = last >= 0xd800 && last <= 0xdbff
  return str.slice(0, endsInHighSurrogate ? end - 1 : end)
}
