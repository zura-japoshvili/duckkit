# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[Unreleased]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.9...HEAD
[0.1.9]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/zura-japoshvili/duckkit/releases/tag/v0.1.1