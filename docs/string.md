# String

[← duckkit README](../README.md) · [All docs](./README.md)

Case conversion, slugs, truncation, HTML escaping and templates. The functions are Unicode-aware: letters from any script count as letters, and emoji are never cut in half.

```typescript
import { capitalize, slugify, camelCase, mask, escapeHtml, template, ... } from 'duckkit/string'
```

**On this page:** [Case conversion](#case-conversion) · [capitalize](#capitalize) · [camelCase](#camelcase) · [snakeCase](#snakecase) · [kebabCase](#kebabcase) · [pascalCase](#pascalcase) · [titleCase](#titlecase) · [words](#words) · [slugify](#slugify) · [truncate](#truncate) · [excerpt](#excerpt) · [isEmpty](#isempty) · [randomId](#randomid) · [countOccurrences](#countoccurrences) · [mask](#mask) · [escapeHtml](#escapehtml) · [unescapeHtml](#unescapehtml) · [stripHtml](#striphtml) · [template](#template)

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
capitalize('😀hello')      // "😀hello" — emoji kept whole
capitalize('éclair')       // "Éclair"
```

> **Scripts whose capitals are only used for all-caps text are left unchanged:** in Georgian, for example, capital letters (Mtavruli) never start a word, so `capitalize` doesn't add one.

---

### camelCase

Converts a string to camelCase. Handles snake_case, kebab-case, spaces, UPPER_SNAKE, camelCase and PascalCase — the input is split with `words()`, so existing word boundaries are kept.

```typescript
camelCase(str: string): string
```

```typescript
camelCase('foo_bar_baz')  // "fooBarBaz"
camelCase('foo-bar-baz')  // "fooBarBaz"
camelCase('foo bar baz')  // "fooBarBaz"
camelCase('FOO_BAR')      // "fooBar"
camelCase('fooBar')       // "fooBar" — already camelCase, unchanged
camelCase('FooBarBaz')    // "fooBarBaz"
camelCase('myAPIKey')     // "myApiKey" — acronyms become one word
camelCase('caféMenu')     // "caféMenu" — humps after accented letters too
```

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

Converts a string to PascalCase. Handles snake_case, kebab-case, spaces, camelCase and PascalCase — the input is split with `words()`, so existing word boundaries are kept.

```typescript
pascalCase(str: string): string
```

```typescript
pascalCase('foo_bar_baz')  // "FooBarBaz"
pascalCase('foo-bar-baz')  // "FooBarBaz"
pascalCase('hello world')  // "HelloWorld"
pascalCase('fooBarBaz')    // "FooBarBaz"
pascalCase('myAPIKey')     // "MyApiKey"
```

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
titleCase("don't stop")    // "Don't Stop" — apostrophes stay inside the word
titleCase('éclair recipe') // "Éclair Recipe" — accented letters too
titleCase('foo_bar baz')   // "Foo_bar Baz" — underscores stay inside the word
titleCase('3rd place')     // "3rd Place"
titleCase("the 'quick' fox") // "The 'Quick' Fox" — words in single quotes too
```

> **Hyphenated words get each part capitalized:** a hyphen separates words.
>
> ```typescript
> titleCase('well-known issue')  // "Well-Known Issue" — may or may not be desired
> ```

> **Scripts whose capitals are only used for all-caps text are left unchanged:** in Georgian, for example, capital letters (Mtavruli) never start a word, so `titleCase` doesn't add them.

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

Converts a string to a lowercase, hyphen-separated slug.

```typescript
slugify(str: string): string
```

```typescript
slugify('Hello World!')       // "hello-world"
slugify('My Blog Post #1')    // "my-blog-post-1"
slugify('  extra   spaces  ') // "extra-spaces"
slugify('a - b -- c')         // "a-b-c" — runs of spaces, _ and - become one hyphen
slugify('!hello!')            // "hello" — leading/trailing hyphens removed
slugify('')                   // ""
```

**Accents are removed, not dropped.** Accented letters lose their accent instead of disappearing, and letters from other alphabets are kept. Punctuation, symbols, fractions and emoji are dropped; full-width letters and digits become plain ones.

```typescript
slugify('Café Résumé')        // "cafe-resume" — a plain [^a-z0-9] regex gives "caf-rsum"
slugify('Tom & Jerry: The Movie') // "tom-jerry-the-movie"
slugify('I ❤️ TS & JS')       // "i-ts-js"
slugify('Duckkit™ Pro')       // "duckkit-pro"
slugify('1½ cups')            // "1-cups"
```

> **Slugs from other alphabets are not ASCII:** they are valid in URLs — browsers show them as typed and send them percent-encoded — but if you need ASCII-only slugs, transliterate first (e.g. with the `transliteration` package) and then call `slugify`.

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
truncate('Hello World', 2, '...') // ".." — the result never exceeds maxLength
truncate('Hi😀there', 6)          // "Hi..." — the emoji does not fit whole, so it is left out
```

**Characters are never cut in half.** Length is measured like `str.length`, but an emoji, flag (🇬🇪), emoji with a skin tone or ZWJ (👨‍👩‍👧), or letter with a combining accent that does not fit whole is left out — never split into broken characters. This uses `Intl.Segmenter` (every current browser, Node.js 16+); without it, at least an emoji is never split in half.

---

## excerpt

Like `truncate` but cuts at a word boundary instead of mid-word. A single word longer than the limit is cut — like `truncate`, never in the middle of a character. The result never exceeds `maxLength`.

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
truncate('Hello World foo bar', 16)  // "Hello World f..." — cuts mid-word
excerpt('Hello World foo bar', 16)   // "Hello World..." — cuts at word boundary
```

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

> **`import { isEmpty } from 'duckkit'` gives the validate version,** which gives the same answer for strings and also handles arrays and objects. `duckkit/string` keeps this string-only one.

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

Uses `crypto.getRandomValues` — secure, no `Math.random`. Every character is equally likely: random bytes that would favour some characters (248–255, since 256 is not a multiple of 62) are thrown away and redrawn.

`length` must be a non-negative integer — anything else throws.

> **Needs the global `crypto`:** available in every current browser and in Node.js 19+. Older Node versions throw `ReferenceError: crypto is not defined`.

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

// Object.prototype members never count — other inherited values (class getters) do
template('{constructor}', {})                         // "{constructor}"
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