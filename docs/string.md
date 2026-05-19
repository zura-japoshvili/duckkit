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

Note: `camelCase('fooBar')` returns `'foobar'` — the input is lowercased first, then separators are used to capitalize.

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

Note: `pascalCase('fooBarBaz')` returns `'Foobarbaz'` — input is lowercased first.

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

They are true inverses of each other:

```typescript
const original = '<script>alert("xss") & more</script>'
unescapeHtml(escapeHtml(original)) === original  // true ✅
```

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
stripHtml('Hello<br/>World')                       // "HelloWorld" — no space added
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