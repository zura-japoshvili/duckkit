# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.6] - 2026-05-21

### Added
- `fn` — `tap`: run a side effect in a pipeline without changing the value
- `fn` — `when`: conditionally apply a function based on a predicate
- `date` — `formatDuration`: format seconds into a human-readable string (e.g. `"1h 1m 1s"`)

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

[0.1.6]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/zura-japoshvili/duckkit/releases/tag/v0.1.1