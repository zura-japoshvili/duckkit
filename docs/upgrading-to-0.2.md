# Upgrading to 0.2

[← duckkit README](../README.md) · [All docs](./README.md)

0.2.0 fixes the published package — several documented imports did not work in 0.1.x — and fixes bugs that 0.1.x documented instead of fixing. Most code needs no change. This page lists every change that can affect existing code, with what to do. The [changelog](../CHANGELOG.md) has the full list.

**Quick check — you only need to act if you:**

- [ ] store slugs from `slugify` (database, URLs) for text with accents or non-Latin letters → [slugify](#slugify)
- [ ] rely on `throttle` dropping the last call → [throttle](#throttle)
- [ ] pass explicit type arguments to `curry`, or curry functions with optional parameters → [curry](#curry)
- [ ] compare exact outputs of `roundTo`, `addMonths`, the case functions, `truncate` or `formatBytes` in tests or stored data → [changed results](#changed-results)
- [ ] run on Node.js older than 20 → [Node.js 20+](#nodejs-20)

---

## Imports that now work

Nothing to do. These failed in 0.1.x and work now:

```typescript
import { slugify } from 'duckkit'               // string functions were missing from the root
import { isEmail } from 'duckkit/validate'      // the validate module was not published
import { encodeBase64 } from 'duckkit/encode'  // pointed to a file that did not exist
```

`isEmpty` from the root is the `duckkit/validate` one: it gives the same answer for strings and also handles arrays and objects.

---

## slugify

Accented letters lose their accent instead of being dropped, and letters from other alphabets are kept. 0.1.x removed every non-ASCII letter.

```typescript
slugify('Café Résumé')   // 0.2: "cafe-resume"    0.1: "caf-rsum"
slugify('a - b')         // 0.2: "a-b"            0.1: "a---b"
```

**What to do:** if you store slugs (in a database or as URLs) and regenerate them from titles, slugs for text with accents, letters from other alphabets or ` - ` will change. Keep the stored slugs, or redirect old URLs. Plain ASCII titles give the same slug, except that runs of hyphens are now collapsed.

---

## throttle

The last call made during the wait now runs when the wait ends; 0.1.x dropped it.

```typescript
const onScroll = throttle(updatePosition, 100)
// 0.2: runs immediately, at most every 100 ms, and once more after scrolling stops
// 0.1: the final position after scrolling stopped could be lost
```

**What to do:** usually nothing — this is the behavior most code expects. For the old behavior pass `{ trailing: false }`. The returned function now also has `cancel()`; call it when the component unmounts so a pending call doesn't run later.

---

## curry

`curry` now works for any number of arguments (0.1.x supported 2 or 3 and returned other functions unchanged).

**What to do:**

- Remove explicit type arguments — let TypeScript infer them:
  ```typescript
  curry<number, number, number>((a, b) => a + b)   // 0.1 style — no longer compiles
  curry((a: number, b: number) => a + b)            // 0.2
  ```
- Functions with optional parameters (`c?: number` or `c = 0`) are rejected at compile time. `curry` counts steps with `fn.length`, which counts the first form but not the second, so the number of steps can't be typed. Wrap them: `curry((a: number, b: number) => f(a, b))`.
- Wrapped functions such as `memo(fn)` report `fn.length` 0, so `curry` throws. Curry the original function, then wrap the result.

---

## Changed results

All of these were wrong in 0.1.x. If you compare exact outputs in tests or stored data, update the expected values.

| Function | Input | 0.2 | 0.1 |
|----------|-------|-----|-----|
| `roundTo` | `roundTo(1.005, 2)` | `1.01` | `1` |
| `truncateTo` | `truncateTo(1.999999999999, 2)` | `1.99` | `2` |
| `addMonths` | `addMonths(Jan 31, 1)` | Feb 28 | Mar 3 |
| `addYears` | `addYears(Feb 29 2024, 1)` | Feb 28 2025 | Mar 1 2025 |
| `camelCase` | `camelCase('fooBar')` | `"fooBar"` | `"foobar"` |
| `pascalCase` | `pascalCase('fooBarBaz')` | `"FooBarBaz"` | `"Foobarbaz"` |
| `kebabCase` | `kebabCase('caféMenu')` | `"café-menu"` | `"cafémenu"` |
| `titleCase` | `titleCase("don't")` | `"Don't"` | `"Don'T"` |
| `truncate` | `truncate('Hello World', 2)` | `".."` | `"Hello Worl..."` |
| `truncate` | `truncate('Hi😀there', 3, '')` | `"Hi"` | `"Hi\ud83d"` (broken emoji) |
| `formatBytes` | `formatBytes(-1024)` | `"-1 KB"` | `"NaN undefined"` |
| `formatBytes` | `formatBytes(1023.999)` | `"1 KB"` | `"1024 B"` |

`roundTo` and `truncateTo` also throw when `decimals` is not an integer, and `randomId` throws on a negative or fractional length — 0.1.x returned meaningless results.

`capitalize` and `titleCase` no longer add an all-caps letter to scripts whose capitals are only used for all-caps text (Georgian).

---

## Errors that now surface

- `delaySkippable` rejects with the error when its `condition` throws. 0.1.x kept polling and threw from a timer every `pollInterval` ms.
- `template` no longer fills `{constructor}` or `{toString}` from `Object.prototype`; they are treated as missing.

---

## Node.js 20+

`package.json` declares `"engines": { "node": ">=20" }` — the oldest version CI tests. npm warns on older Node and Yarn 1 refuses to install. Browsers are not affected.
