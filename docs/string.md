# String

```typescript
import { capitalize, slugify, camelCase, mask, escapeHtml, template, ... } from 'duckkit/string'
```

---

## Case conversion

### capitalize

Capitalizes the first letter. Rest of the string is unchanged.

```typescript
capitalize(str: string): string
```

```typescript
capitalize('hello world')  // "Hello world"
capitalize('hELLO')        // "HELLO" — only first letter changed
capitalize('')             // ""
```

> **Breaks on emoji and multi-code-unit characters:** `charAt(0)` operates on UTF-16 code units. Emoji and characters above U+FFFF are two code units — `charAt(0)` returns the first half of the surrogate pair, splitting the character and corrupting the string.
>
> ```typescript
> capitalize('😀hello')  // "\uD83Dhello" — emoji is split ❌
> ```
>
> For Unicode-safe first-character access, use spread or `[...str][0]`:
>
> ```typescript
> function capitalizeSafe(str: string): string {
>   if (!str) return str
>   const chars = [...str]
>   return chars[0]!.toUpperCase() + chars.slice(1).join('')
> }
> ```

---

### camelCase

Converts a string to camelCase. Handles snake_case, kebab-case, spaces, and UPPER_SNAKE.

```typescript
camelCase(str: string): string
```

```typescript
camelCase('foo_bar_baz')  // "fooBarBaz"
camelCase('foo-bar-baz')  // "fooBarBaz"
camelCase('foo bar baz')  // "fooBarBaz"
camelCase('FOO_BAR')      // "fooBar"
```

> **Already-camelCase input gets flattened:** The input is fully lowercased before separators are processed. Existing camel humps are lost.
>
> ```typescript
> camelCase('fooBar')     // "foobar" ⚠️ — not "fooBar"
> camelCase('myAPIKey')   // "myapikey" ⚠️
> ```
>
> Only use this to convert from a clearly-separated format (snake, kebab, spaces). Not for re-casing already-camel strings.

---

### snakeCase

Converts a string to snake_case. Handles camelCase, kebab-case, and spaces.

```typescript
snakeCase(str: string): string
```

```typescript
snakeCase('fooBarBaz')   // "foo_bar_baz"
snakeCase('foo-bar-baz') // "foo_bar_baz"
snakeCase('FOOBar')      // "foo_bar"
```

---

### kebabCase

Converts a string to kebab-case. Handles camelCase, snake_case, and spaces.

```typescript
kebabCase(str: string): string
```

```typescript
kebabCase('fooBarBaz')   // "foo-bar-baz"
kebabCase('foo_bar_baz') // "foo-bar-baz"
kebabCase('FOOBar')      // "foo-bar"
```

---

### pascalCase

Converts a string to PascalCase. Handles snake_case, kebab-case, and spaces.

```typescript
pascalCase(str: string): string
```

```typescript
pascalCase('foo_bar_baz')  // "FooBarBaz"
pascalCase('foo-bar-baz')  // "FooBarBaz"
pascalCase('hello world')  // "HelloWorld"
```

> **Already-camelCase input gets flattened:** Same as `camelCase` — the input is lowercased first.
>
> ```typescript
> pascalCase('fooBarBaz')  // "Foobarbaz" ⚠️ — not "FooBarBaz"
> ```

---

### titleCase

Capitalizes the first letter of every word.

```typescript
titleCase(str: string): string
```

```typescript
titleCase('hello world')   // "Hello World"
titleCase('hello  world')  // "Hello  World" — preserves spacing
titleCase('hELLO wORLD')   // "HELLO WORLD" — does not lowercase existing uppercase
```

> **Hyphenated words get each part capitalized:** `\b` (word boundary) exists on both sides of a hyphen since `-` is not a word character. Each part of a hyphenated word is treated as a separate word.
>
> ```typescript
> titleCase('well-known issue')  // "Well-Known Issue" — may or may not be desired
> ```

---

## words

Splits a string into an array of lowercase words. Handles camelCase, snake_case, kebab-case, and spaces.

```typescript
words(str: string): string[]
```

```typescript
words('fooBarBaz')    // ["foo", "bar", "baz"]
words('foo_bar_baz')  // ["foo", "bar", "baz"]
words('foo-bar-baz')  // ["foo", "bar", "baz"]
words('hello world')  // ["hello", "world"]
words('FOOBar')       // ["foo", "bar"]
words('')             // []
```

Useful as a building block for custom case conversion.

---

## slugify

Converts a string to a URL-safe slug.

```typescript
slugify(str: string): string
```

```typescript
slugify('Hello World!')       // "hello-world"
slugify('My Blog Post #1')    // "my-blog-post-1"
slugify('  extra   spaces  ') // "extra-spaces"
slugify('!hello!')            // "hello" — leading/trailing hyphens removed
slugify('')                   // ""
```

> **Non-ASCII letters are stripped entirely:** The `[^\w\s-]` filter uses `\w`, which is ASCII-only in JS (`[a-zA-Z0-9_]`). Accented, CJK, Cyrillic, and other Unicode letters are removed — not transliterated.
>
> ```typescript
> slugify('Héllo Wörld')  // "hllo-wrld" ❌ — é and ö are removed
> slugify('Привет')       // "" ❌ — Cyrillic stripped entirely
> ```
>
> If you need to support non-ASCII titles, transliterate to ASCII first (e.g. `héllo` → `hello`) before calling `slugify`, or use a library like `slugify` (npm) that handles Unicode transliteration.

---

## truncate

Truncates a string to a max length, appending a suffix if cut. The suffix is included in the max length.

```typescript
truncate(str: string, maxLength: number, suffix?: string): string
```

```typescript
truncate('Hello World', 8)        // "Hello..."
truncate('Hello World', 8, ' →')  // "Hello  →"
truncate('Hi', 8)                 // "Hi" — fits, unchanged
truncate('Hello World', 5, '')    // "Hello" — empty suffix
truncate('Hello World', 3, '...') // "..." — suffix fills entire length
```

> **`suffix` longer than `maxLength` produces output over the limit:** `str.slice(0, maxLength - suffix.length)` gets a negative index when `suffix.length > maxLength`. A negative slice index counts from the end of the string, making the result far longer than intended.
>
> ```typescript
> truncate('Hello World', 2, '...')  // "Hello Worl..." ❌ — not 2 chars
> ```
>
> Always ensure `maxLength > suffix.length`. A safe check: `if (maxLength <= suffix.length) return suffix.slice(0, maxLength)`.

---

## excerpt

Like `truncate` but cuts at a word boundary instead of mid-word.

```typescript
excerpt(str: string, maxLength: number, suffix?: string): string
```

```typescript
excerpt('Hello World foo bar', 15)      // "Hello World..."
excerpt('Hello World foo', 14, ' →')    // "Hello World →"
excerpt('Short', 20)                    // "Short" — fits unchanged
excerpt('Superlongword', 8)             // "Super..." — no space found, cuts at limit
excerpt('', 10)                         // ""
```

Key difference from `truncate`:

```typescript
truncate('Hello World foo', 13)  // "Hello World f..." — cuts mid-word
excerpt('Hello World foo', 13)   // "Hello World..." — cuts at word boundary
```

> **Same `suffix > maxLength` bug as `truncate`:** If `suffix.length > maxLength`, `limit` becomes negative and the result is longer than `maxLength`. Same fix applies.

---

## isEmpty

Returns `true` if the string is empty or contains only whitespace.

```typescript
isEmpty(str: string): boolean
```

```typescript
isEmpty('')       // true
isEmpty('   ')    // true
isEmpty('\n\t')   // true
isEmpty('hello')  // false
isEmpty(' hi ')   // false
```

---

## randomId

Generates a cryptographically secure random alphanumeric ID using `crypto.getRandomValues`.

```typescript
randomId(length?: number): string
```

```typescript
randomId()     // "xK9mP2qL" — 8 chars default
randomId(12)   // "xK9mP2qLwZ4n"
randomId(4)    // "xK9m"
randomId(0)    // ""
```

Uses `crypto.getRandomValues` — secure, no `Math.random`. Works in browser and Node 18+.

> **Slight character distribution bias:** The charset has 62 characters. Byte values 0–255 don't divide evenly by 62 (remainder 8), so the first 8 characters in the charset (`A–H`) are selected slightly more often than the rest. For most use cases the bias is negligible, but it's not perfectly uniform.

> **`crypto` not available in Node < 18:** `crypto.getRandomValues` is a global in browsers and Node 18+. Older Node versions throw `ReferenceError: crypto is not defined`. If you need to support Node < 18, import it explicitly: `import { webcrypto as crypto } from 'crypto'`.

---

## countOccurrences

Counts non-overlapping occurrences of a substring. Case-sensitive.

```typescript
countOccurrences(str: string, substring: string): number
```

```typescript
countOccurrences('hello world hello', 'hello')  // 2
countOccurrences('mississippi', 's')            // 4
countOccurrences('aaa', 'aa')                   // 1 — non-overlapping
countOccurrences('Hello hello', 'hello')        // 1 — case sensitive
countOccurrences('hello', '')                   // 0 — empty substring returns 0
```

---

## mask

Masks a string, revealing only the last N characters.

```typescript
mask(str: string, visibleCount?: number, maskChar?: string): string
```

```typescript
mask('4242424242424242')        // "************4242"
mask('my-secret-api-key', 6)   // "**********pi-key"
mask('hello', 0)               // "*****" — mask all
mask('hi', 10)                 // "hi" — visible count >= length, returns full string
mask('hello', 2, '•')          // "•••lo" — custom mask char
mask('', 4)                    // ""
```

> **Multi-character `maskChar` produces a longer result than expected:** `maskChar.repeat(n)` repeats the entire string `n` times. A 2-char mask char representing 1 masked character doubles the masked portion's length.
>
> ```typescript
> mask('hello', 4, '**')  // "**ello" — 2 chars masking 1 position ⚠️
> ```
>
> Stick to single-character values for `maskChar`.

---

## escapeHtml

Escapes HTML special characters. Use before inserting user-generated content into HTML to prevent XSS.

```typescript
escapeHtml(str: string): string
```

| Character | Escaped |
|-----------|---------|
| `&` | `&amp;` |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `"` | `&quot;` |
| `'` | `&#39;` |

```typescript
escapeHtml('<script>alert("xss")</script>')
// "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"

escapeHtml('Hello & "World"')
// "Hello &amp; &quot;World&quot;"
```

> **Double-applying creates double-encoded output:** Running `escapeHtml` on already-escaped content encodes the `&` in entities like `&lt;`, turning them into `&amp;lt;`.
>
> ```typescript
> escapeHtml(escapeHtml('<'))  // "&amp;lt;" ❌ — not "&lt;"
> ```
>
> Only call `escapeHtml` on raw, unescaped input.

---

## unescapeHtml

Reverses `escapeHtml`. Converts HTML entities back to their original characters.

```typescript
unescapeHtml(str: string): string
```

```typescript
unescapeHtml('&lt;div&gt;Hello &amp; World&lt;/div&gt;')
// "<div>Hello & World</div>"
```

They are true inverses of each other for the 5 covered entities:

```typescript
const original = '<script>alert("xss") & more</script>'
unescapeHtml(escapeHtml(original)) === original  // true ✅
```

> **Only handles the 5 entities from `escapeHtml`:** Other named entities like `&nbsp;`, `&copy;`, `&eacute;`, and numeric entities like `&#160;` or `&#x00A0;` are not replaced — they pass through unchanged.
>
> ```typescript
> unescapeHtml('&nbsp;&copy;')  // "&nbsp;&copy;" — unchanged ⚠️
> ```
>
> For full HTML entity decoding, use a DOM-based approach (`textarea.innerHTML = str`) or a library like `he`.

> **`&amp;lt;` fully unescapes to `<`:** Because `&amp;` is replaced first in the chain, `&amp;lt;` becomes `&lt;`, which then becomes `<`. If the input was double-escaped, `unescapeHtml` will over-decode it.
>
> ```typescript
> unescapeHtml('&amp;lt;')  // "<" — not "&lt;" ⚠️
> ```

---

## stripHtml

Removes all HTML tags from a string, keeping only the text content.

```typescript
stripHtml(str: string): string
```

```typescript
stripHtml('<p>Hello <strong>World</strong></p>')  // "Hello World"
stripHtml('<a href="/about">About us</a>')         // "About us"
stripHtml('No tags here')                          // "No tags here"
stripHtml('Hello<br/>World')                       // "HelloWorld" — no space added between tags
```

Does not unescape HTML entities — use `unescapeHtml` after if needed. Does not sanitize — use a dedicated library for XSS protection.

---

## template

Simple string interpolation using `{key}` placeholders.

```typescript
template(str: string, data: Record<string, string | number>, fallback?: string): string
```

```typescript
template('Hello {name}!', { name: 'Zura' })          // "Hello Zura!"
template('{title} {lastName}', { title: 'Mr', lastName: 'J' })  // "Mr J"
template('Score: {score}', { score: 42 })             // "Score: 42"

// missing keys — left as-is by default
template('Hello {name}!', {})                         // "Hello {name}!"

// missing keys — with fallback
template('Hello {name}!', {}, 'stranger')             // "Hello stranger!"
```

> **Keys must match `\w+` — hyphens and dots silently don't work:** The placeholder regex is `/\{(\w+)\}/g`, which only matches letters, digits, and underscores. Keys with hyphens or dots never resolve.
>
> ```typescript
> template('{my-key}', { 'my-key': 'value' })     // "{my-key}" — no match ⚠️
> template('{user.name}', { 'user.name': 'Zura' }) // "{user.name}" — no match ⚠️
> ```
>
> Stick to alphanumeric keys with underscores: `{user_name}`, `{first_name}`.

> **`{{key}}` partially resolves:** The inner `{key}` matches, leaving the outer braces in the result.
>
> ```typescript
> template('{{name}}', { name: 'Zura' })  // "{Zura}" ⚠️
> ```