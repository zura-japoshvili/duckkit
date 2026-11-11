# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-11-11

This release fixes the published package (several documented imports did not work) and turns
documented bugs into fixes. Some outputs change — see **Changed**.

### Fixed — packaging
- `import { slugify } from 'duckkit'` (the first README example) failed: the root export did not include `string` or `validate`. It now includes every module
- `duckkit/encode` pointed to a file that was never built; `duckkit/validate` (22 functions) was not published at all. Both are now built and exported
- CommonJS consumers on `moduleResolution: node16` got ESM type declarations; `require` now resolves to `.d.cts`. Sub-path types also resolve under the old `moduleResolution: node` via `typesVersions`
- Added `"sideEffects": false` so bundlers can tree-shake the root import

### Changed
- `number/roundTo` — rounds the decimal you wrote: `roundTo(1.005, 2)` is now `1.01` (was `1`), `roundTo(1.255, 2)` is `1.26` (was `1.25`). Throws on non-integer `decimals`. Values too large to shift (`roundTo(1e300, 10)`) are returned unchanged
- `number/truncateTo` — no longer adds a `1e-9` epsilon, which could round up (`truncateTo(1.999999999999, 2)` was `2`, now `1.99`). Throws on non-integer `decimals`
- `date/addMonths`, `date/addYears` — clamp to the last day of the month: Jan 31 + 1 month is Feb 28 (was Mar 3), Feb 29 + 1 year is Feb 28 (was Mar 1). The time of day is kept across daylight-saving changes, and years 0–99 are not mapped to 1900–1999
- `async/throttle` — calls made while waiting are no longer dropped: the last one runs when the wait ends. Pass `{ trailing: false }` for the old behavior. Returns `Throttled<Args>` with `cancel()`. Windows longer than `setTimeout` allows (~24.8 days) and `ms = Infinity` work
- `fn/curry` — works for any number of arguments (was 2 or 3; 4+ was returned uncurried). Rejected at compile time: functions with fewer than 2 parameters and functions with optional parameters (`c?: T`, `c = x`) — `fn.length` counts the first but not the second, so the step count can't be typed. At runtime, a function with `fn.length` below 2 (including wrapped ones like `memo(fn)`) throws instead of being returned uncurried. **Type break:** explicit type arguments like `curry<number, number, number>(…)` no longer compile — let TypeScript infer them
- `string/slugify` — keeps letters from every script (Georgian, Cyrillic, CJK, …) and removes accents from Latin letters: `'Crème Brûlée'` → `'creme-brulee'` (was `'crme-brle'`), `'Привет'` → `'привет'` (was `''`). Runs of spaces, `_` and `-` become one hyphen (`'a - b'` was `'a---b'`). Full-width letters and digits become plain (`'ＡＢＣ１２３'` → `'abc123'`); symbols and fractions are still dropped (`'Duckkit™ Pro'` → `'duckkit-pro'`)
- `string/camelCase`, `string/pascalCase` — keep existing word boundaries: `camelCase('fooBar')` is `'fooBar'` (was `'foobar'`), `pascalCase('fooBarBaz')` is `'FooBarBaz'` (was `'Foobarbaz'`)
- `string/words`, `string/kebabCase`, `string/snakeCase`, `string/camelCase`, `string/pascalCase` — split humps in any cased script, not only A–Z: `kebabCase('grüßGott')` is `'grüß-gott'` (was `'grüßgott'`), `camelCase('приветМир')` is `'приветМир'` (was `'приветмир'`)
- `string/titleCase` — works for any script and keeps apostrophes inside words: `"don't"` → `"Don't"` (was `"Don'T"`), `'élan'` → `'Élan'` (was `'éLan'`). Words in single quotes are still capitalized (`"'quick'"` → `"'Quick'"`)
- `string/capitalize`, `string/titleCase` — leave Georgian unchanged; `capitalize` used to turn the first letter into Mtavruli, which Georgian only uses for all-caps text. `camelCase` and `pascalCase` still mark Georgian word boundaries with Mtavruli (`'გამარჯობა მსოფლიო'` → `'გამარჯობაᲛსოფლიო'`), as before
- `string/randomId` — throws on a negative or non-integer `length`
- `delay/delaySkippable` — rejects with the error when `condition` throws, instead of throwing from a timer every `pollInterval` ms
- `isEmpty` from the root is the `validate` one (strings, arrays, objects); `duckkit/string` keeps the string-only version
- `package.json` declares `"engines": { "node": ">=20" }`, the oldest version CI tests. npm warns on older Node; Yarn 1 refuses to install. Browsers are not affected

### Fixed
- `array/groupBy`, `array/flatGroupBy` — crashed with "push is not a function" on keys like `"constructor"` or `"toString"`
- `array/countBy` — returned garbage like `"function Object() { [native code] }1"` for such keys
- `"__proto__"` as a key (e.g. from `JSON.parse`) replaced the result's prototype instead of being stored as data in `groupBy`, `flatGroupBy`, `countBy`, `keyBy`, `deepClone`, `deepMerge`, `pick`, `mapKeys`, `mapValues`, `filterKeys`, `filterValues`, `invertObject`, `flattenObject`, `mergeIf`. With `deepClone(JSON.parse('{"__proto__": {"isAdmin": true}}'))`, `clone.isAdmin` was `true`
- `string/template` — `{constructor}` or `{toString}` were filled with function source from `Object.prototype`. Values inherited from other prototypes (class getters, `Object.create`) are still used
- `string/randomId` — characters `A`–`H` were slightly more likely (`byte % 62` bias); bytes that would cause it are now redrawn. IDs longer than 65 536 characters work
- `string/capitalize` — split a leading emoji into a broken surrogate
- `string/truncate`, `string/excerpt` — could return more than `maxLength` when the suffix did not fit
- `string/truncate`, `string/excerpt` — cut characters in half: `truncate('Hi😀there', 3, '')` returned a broken surrogate (`'Hi\ud83d'`). Emoji, flags, ZWJ/skin-tone emoji and accented letters that don't fit whole are now left out (uses `Intl.Segmenter`; without it, surrogate pairs are still never split)
- `string/excerpt` — dropped a word that ended exactly at the limit (`excerpt('Hello World foo', 14)` was `'Hello...'`, now `'Hello World...'`), and returned only the suffix for a long first word after leading spaces
- `number/formatBytes` — negative values gave `"NaN undefined"` and values from 2^60 up gave `"… undefined"`. Now `-1 KB`, `1 EB`, up to `YB`. When rounding reaches 1024 the next unit is used (`formatBytes(1023.999)` was `"1024 B"`, now `"1 KB"`)
- `object/mergeIf` — the type did not accept `null` (or `undefined` under `exactOptionalPropertyTypes`), although skipping them is the function's purpose

### Added
- `async/debounce` — `cancel()` and `flush()`; returns `Debounced<Args>`
- `async/throttle` — `cancel()` and the `trailing` option
- Types `Debounced`, `Throttled`, `Curried`

### Tooling
- `npm run check:package` — packs the package, installs the tarball and loads every entry point with `import` and `require`; checks the root export and the README function list; runs `publint` and `are-the-types-wrong`. Runs in CI, before publish, and in `prepublishOnly`
- `npm run lint` also type-checks the tests (`tsconfig.test.json`)
- `npm run test:timezones` — runs the date tests in Sydney, Asunción and New York time, where daylight-saving bugs show up (CI itself runs in UTC). Runs in CI and before publish
- CI runs on Node 20, 22 and 24
- Publish workflow uses Node 24 and npm 11.5.1+, which trusted publishing needs — with Node 22's npm 10, every publish run so far failed at `npm publish`
- `retry` backoff test uses fake timers (was flaky under load)

---

## [0.1.10] - 2026-05-29

### Fixed
- `async/once` — if the wrapped function throws on its first call, `once` no longer marks itself as called and returns `undefined` forever after. The `called` flag is now set only after `fn` succeeds, so a failed first call retries on the next invocation
- `date/timeAgo` — dates 360–364 days in the past now return `"1 year ago"` instead of `"0 years ago"`. `months` reached 12 (at 12 × 30 days) before `years` reached 1 (at 365 days), leaving a gap

### Docs
- `number/roundTo` — corrected the JSDoc example (`roundTo(1.005, 2)` is `1.00`, not `1.01`) and added a floating-point remark
- `docs/number.md` — fixed the `roundTo` midpoint footgun: the documented `1.045 → 1.04` case was wrong (it correctly rounds to `1.05`); replaced with genuinely affected values (`1.005`, `1.015`, `1.255`). Softened `truncateTo`'s "never larger in absolute value" wording to note the `1e-9` epsilon
- `docs/date.md` — documented `formatDuration` (shipped in 0.1.6 but never documented)
- `README.md` — moved `formatDuration` from the Number section to Date (it is exported from `duckkit/date`, not `duckkit/number`); corrected the `groupBy` examples to `Partial<Record<K, T[]>>` with optional-chained access so they compile under `strict`

### Tests
- `date` — regression tests for the `timeAgo` 360–364 day gap and documented future-date behavior
- `number` — locked documented edge behavior: `roundTo` float midpoints, `truncateTo` negatives, `normalize` single-point range (`NaN`), `toOrdinal` float/`NaN`, `formatBytes` negative and beyond-PB
- `string` — `slugify` non-ASCII stripping (accented + Cyrillic)
- `async` — regression test for `once` retrying after a first-call throw

---

## [0.1.9] - 2026-05-28

### Fixed
- `async/retry` — throws a clear error on invalid `times` (`< 1`, non-integer, `NaN`) instead of throwing a generic "retry failed" without ever calling `fn`. Corrected the backoff delay example in the docs (`times=3` produces 2 delays, not 3)
- `async/parallel` — throws on negative or non-integer `concurrency` instead of silently returning an array of `undefined`
- `async/memo`, `async/memoAsync` — throw on negative or non-integer `maxSize`; eviction check no longer skipped for valid sizes

### Changed
- `emitter/emit` — handler list is now snapshotted at emit time. Handlers added during an emit fire on the next emit, not the current one; handlers removed during an emit still fire the current round. Prevents re-entrancy loops and matches Node `EventEmitter`. Breaking if you relied on the old live-iteration behavior
- `async/parallel` — `concurrency: 0` now throws (was silently treated as unlimited). Omit the option for unlimited concurrency
- `async/memo`, `async/memoAsync` — `maxSize: 0` now throws (was silently treated as "no limit"). Omit the option for an unbounded cache

### Refactor
- `fn/composeAsync` — reverse the composed functions once at creation time instead of on every call

### Docs
- `docs/async.md` — corrected the `retry` backoff example; documented `JSON.stringify` keying limits for `memo`/`memoAsync` (BigInt and circular refs throw, object key order matters, `null`/`undefined` collide); added `this`-binding note for `debounce`/`throttle`; noted `concurrency` validation for `parallel`
- `docs/fn.md` — noted that typing goes loose beyond 5 composed steps; expanded the `curry` default-params limitation
- `docs/emitter.md` — documented the emit snapshot semantics and the `Set` dedup behavior of `on`

---

## [0.1.8] - 2026-05-27

### Security
- `object/unflattenObject` — prevent prototype pollution by skipping keys with `__proto__`, `constructor`, or `prototype` segments. Safe on untrusted input

### Fixed
- `object/deepClone` — `Map`, `Set`, `RegExp`, and class instances no longer silently cloned to `{}`. They now pass through by reference; use `structuredClone()` for full fidelity
- `object/deepMerge` — no longer walks into `Map`, `Set`, `RegExp`, and class instances as plain objects. Treated as leaf values, override wins
- `object/flattenObject` — `Date` values and empty nested objects no longer silently dropped
- `object/isEqual` — `NaN` now equals `NaN`. `Map`, `Set`, and `RegExp` compared correctly (were false positives). Class instances no longer equal plain objects with the same own keys
- `object/pick` — no longer copies inherited properties from the prototype chain
- `array/flatten` — switched to native `Array.prototype.flat()`. Previous spread-based implementation stack-overflowed on inputs around 10k+ inner arrays
- `array/chunk` — throws on non-integer, `NaN`, `Infinity`, and negative size (previously produced garbage chunks or empty results)
- `array/maxBy`, `array/minBy` — `NaN` from the iteratee no longer poisons the comparison; valid numbers always win

### Changed
- `array/groupBy`, `array/keyBy`, `array/countBy`, `array/flatGroupBy` — return type is now `Partial<Record<K, ...>>` to reflect runtime. Missing keys read as `undefined`; TypeScript forces `?.` or `?? 0` access. Breaking at the type level only — no runtime behavior change
- `object/objectDiff` — return type simplified from `(keyof T | string)[]` to `string[]`

### Refactor
- `object/index` — `DeepReadonly` exported via `export type` for `isolatedModules` compatibility
- `object/deepClone` — internal `arr.map(deepClone)` replaced with explicit arrow form

### Docs
- `docs/object.md` — added prototype pollution note for `unflattenObject`, behavior notes for `deepMerge`/`flattenObject`/`deepClone`, removed warnings for now-fixed bugs (NaN, Map/Set/RegExp false positives)
- `docs/array.md` — updated `groupBy`/`keyBy`/`countBy`/`flatGroupBy` for new Partial types, integer requirement for `chunk`, NaN behavior for `min`/`maxBy`, floating-point note for `sum`/`sumBy`, duplicate-preservation note for `intersection`/`difference`

---

## [0.1.7] - 2026-05-22

### Added
- `validate` — `isEmail`, `isUrl`, `isUUID`, `isIP`, `isIPv4`, `isIPv6`, `isCreditCard`, `isPhone`
- `validate` — `isString`, `isNumber`, `isBoolean`, `isArray`, `isObject`, `isDate`, `isFunction`
- `validate` — `isNull`, `isUndefined`, `isNullOrUndefined`, `isPromise`
- `validate` — `isEmpty`, `isEmptyObject`, `isEnum`, `isNaN`, `isFinite`
- `encode` — `encodeBase64`, `decodeBase64`, `encodeBase64Url`, `decodeBase64Url`
- `encode` — `encodeHex`, `decodeHex`, `encodeUri`, `decodeUri`, `encodeJson`, `decodeJson`
- `object` — `deepFreeze`, `objectDiff`, `mergeIf`, `hasOwn`

### Docs
- README updated with Available Utilities table, Key Features sections, Why duckkit section
- `docs/validate.md`, `docs/encode.md` added
- `docs/object.md` updated with new functions

---

## [0.1.6] - 2026-05-21

### Added
- `fn` — `tap`: run a side effect in a pipeline without changing the value
- `fn` — `when`: conditionally apply a function based on a predicate
- `number` — `formatDuration`: format seconds into a human-readable string (e.g. `"1h 1m 1s"`)

### Chore
- `CHANGELOG.md` added
- README and `package.json` updated for improved clarity and feature highlights

---

## [0.1.5] - 2026-05-20

### Added
- `emitter` — fully typed event emitter with `on`, `off`, `once`, `emit`, `clear`
- `fn` — `pipeline`, `compose`, `pipelineAsync`, `composeAsync`, `curry`
- `async` — `maxSize` option for `memo` and `memoAsync` to cap cache size

### Fixed
- `async` — improved error handling in `repeat`

### Chore
- version bumped to `0.1.5`, package description updated

---

## [0.1.4] - 2026-05-20

### Docs
- edge case notes added to `array`, `async`, `object`, `number`, `string`, `date`, `delay` modules

### Fixed
- CI — resolved npm trusted publishing with Node 22

---

## [0.1.3] - 2026-05-19

### Added
- `array` — `compact`, `sum`, `sumBy`, `keyBy`, `shuffle`, `flatten`, `range`, `without`, `union`, `intersection`, `difference`, `countBy`, `sample`
- `object` — `invertObject`, `filterKeys`, `filterValues`, `flattenObject`, `unflattenObject`, `mapKeys`, `mapValues`, `isEqual`, `keys`, `values`, `entries`, `fromEntries`
- `async` — `once`, `memoAsync`, `defer`, `parallel`, `sequential`
- `date` — `startOfDay`, `endOfDay`, `startOfWeek`, `startOfMonth`, `isSameDay`, `addMonths`, `addYears`
- `number` — `average`, `normalize`, `toOrdinal`, `toRoman`, `formatNumber`, `formatBytes`, `truncateTo`
- `string` — `escapeHtml`, `unescapeHtml`, `template`, `words`, `mask`, `stripHtml`, `excerpt`
- docs for `date`, `delay`, `number`, `object`, `string` modules

### Fixed
- `delay` — removed duplicate `setTimeout` in `delaySkippable`

---

## [0.1.2] - 2026-05-15

### Added
- MIT License
- `CONTRIBUTING.md`, pull request template, `SECURITY.md`, `CODE_OF_CONDUCT.md`
- issue templates

### Refactor
- `string/randomId` — switched to `crypto.getRandomValues` for cryptographic security

### Docs
- README and `package.json` keywords updated

### CI
- switched to npm trusted publishing, removed `NODE_AUTH_TOKEN`

---

## [0.1.1] - 2026-05-14

### Added
- Initial release
- `array` — `groupBy`, `flatGroupBy`, `sortBy`, `topBy`, `minBy`, `maxBy`, `partition`, `chunk`, `unique`, `zip`
- `object` — `pick`, `omit`, `deepClone`, `deepMerge`
- `async` — `safe`, `safeAsync`, `pipe`, `memo`, `debounce`, `throttle`, `retry`, `timeout`, `once`
- `date` — `timeAgo`, `formatDate`, `daysBetween`, `addDays`, `subDays`, `isBefore`, `isAfter`, `isToday`, `isYesterday`, `isWeekend`, `isThisWeek`, `isThisYear`
- `number` — `clamp`, `lerp`, `roundTo`, `randomInt`, `inRange`
- `string` — `capitalize`, `truncate`, `slugify`, `camelCase`, `snakeCase`, `kebabCase`, `pascalCase`, `titleCase`, `isEmpty`, `randomId`, `countOccurrences`
- `delay` — `delay`, `delaySkippable`, `delayWithAbort`, `repeat`
- Tree-shakeable ESM + CJS dual build via `tsup`
- Full TypeScript declarations

---

[Unreleased]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.10...HEAD
[0.1.10]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.9...v0.1.10
[0.1.9]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/zura-japoshvili/duckkit/releases/tag/v0.1.1