# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.6] - 2026-05-21

### Added

- `fn/tap`: execute a side-effect function and return the original value unchanged
- `fn/when`: conditionally apply a function based on a predicate
- `date/formatDuration`: format a duration (in milliseconds or seconds) into a human-readable string (e.g. "2h 30m 15s")

## [0.1.5] - 2026-05-20

### Added

- `emitter`: typed `EventEmitter` class with `on`, `off`, `once`, and `emit` support
- `fn/pipe`: left-to-right function composition
- `fn/compose`: right-to-left function composition
- `fn/curry`: auto-currying for functions of any arity
- `fn/partial`: partial application helper
- `fn/memoize`: memoization with configurable `maxSize` cache eviction
- `async/memoAsync`: async-aware memoization with `maxSize` support

### Fixed

- Improved error handling across async utilities

### Docs

- Added edge-case notes to array, async, object, number, string, date, and delay module docs

## [0.1.4] - 2026-05-20

### Docs

- Added documentation pages for `date`, `delay`, `number`, `object`, and `string` utilities

### Fixed

- CI publishing: aligned npm trusted publishing with Node 22 requirements

## [0.1.3] - 2026-05-19

### Added

- `array/compact`: remove falsy values from an array
- `array/sum`: sum numeric values in an array
- `array/keyBy`: create an object keyed by a property or selector
- `array/shuffle`: randomly shuffle an array
- `array/flatten`: deeply flatten nested arrays
- `array/range`: generate a numeric range array
- `object/invertObj`: swap keys and values of an object
- `async/once`: wrap a function so it executes only once
- `async/memoAsync`: memoize async functions
- `async/defer`: defer execution to the next microtask/tick
- `async/parallel`: run async tasks in parallel and collect results
- `async/sequential`: run async tasks sequentially and collect results
- `date/startOfDay`, `date/endOfDay`: get the start/end of a given day
- `date/startOfWeek`, `date/startOfMonth`: get the start of a week or month
- `date/isSameDay`: check whether two dates fall on the same calendar day
- `date/addMonths`: add a number of months to a date
- `number/average`: compute the average of a list of numbers
- `number/normalize`: normalize a value into a [0, 1] range
- `number/toOrdinal`: convert a number to its ordinal string (e.g. "1st", "2nd")
- `number/toRoman`: convert a number to a Roman numeral string
- `number/formatNumber`: locale-aware number formatting
- `number/formatBytes`: format a byte count into a human-readable size string
- `string/escapeHtml` / `string/unescapeHtml`: HTML entity encoding and decoding
- `string/template`: lightweight string interpolation
- `string/words`: split a string into words
- `string/mask`: mask part of a string (e.g. for credit-card numbers)
- `string/stripHtml`: remove HTML tags from a string
- `string/truncate` (and additional string utilities)

### Fixed

- `delay/delaySkippable`: removed duplicate `setTimeout` call

## [0.1.2] - 2026-05-15

### Added

- MIT License
- `CONTRIBUTING.md`, pull-request template, and `SECURITY.md`
- `randomId`: cryptographically secure random ID generation (replaced `Math.random`-based implementation)

### Docs

- Updated README and package.json keywords

### CI

- Switched to npm trusted publishing (removed explicit `NODE_AUTH_TOKEN`)

## [0.1.1] - 2026-05-14

### Added

- Initial release of **duckkit** — TypeScript-first zero-dependency utility library
- `array`: `groupBy`, `flatGroupBy`, `topBy`, `unique`, `chunk`, and more
- `object`: `pick`, `omit`, `deepClone`, `deepMerge`, `deepEqual`, and more
- `string`: `capitalize`, `camelCase`, `slugify`, `timeAgo`, `formatDate`, and more
- `number`: `clamp`, `lerp`, `randomInt`, `roundTo`, and more
- `date`: `isToday`, `isWeekend`, `diffInDays`, `addDays`, `formatDate`, and more
- `delay`: `delay`, `debounce`, `throttle`, `delaySkippable`, and more
- `async`: `retry`, `timeout`, `asyncMap`, `asyncFilter`, and more
- `fn`: `pipe`, `identity`, `noop`, and more
- `safe` / `Result` type: `safe`, `safeAsync`, `unwrap`, `unwrapOr` for typed error handling
- Tree-shakeable ESM + CJS dual build via `tsup`
- Full TypeScript type definitions

[0.1.6]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/zura-japoshvili/duckkit/releases/tag/v0.1.1
