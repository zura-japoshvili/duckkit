# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.6] - 2026-05-21

### Added
- `fn`: `tap` — run a side effect on a value and return it unchanged
- `fn`: `when` — conditionally apply a function based on a predicate
- `date`: `formatDuration` — format millisecond durations into human-readable strings (e.g. `"2h 5m 30s"`)

## [0.1.5] - 2026-05-20

### Added
- `emitter`: typed `EventEmitter` for pub/sub patterns with full TypeScript support
- `fn`: `pipe`, `compose`, `curry`, `partial` — function composition utilities
- `memo`: `maxSize` option to cap the memoization cache size

### Fixed
- `async`: improved error handling in `repeat`

## [0.1.4] - 2026-05-20

### Added
- `docs`: edge case notes added for `array`, `async`, `object`, `number`, `string`, `date`, and `delay` modules

### Fixed
- CI: resolved Node 22 trusted publishing issue

## [0.1.3] - 2026-05-19

### Added
- `array`: `compact`, `sum`, `keyBy`, `shuffle`, `flatten`, `range`, and more
- `object`: `invertObject`, `filterKeys`, `flattenObject`, and more
- `async`: `once`, `memoAsync`, `defer`, `parallel`, `sequential`
- `date`: `startOfDay`, `endOfDay`, `startOfWeek`, `startOfMonth`, `isSameDay`, `addMonths`, `addYears`
- `number`: `average`, `normalize`, `toOrdinal`, `toRoman`, `formatNumber`, `formatBytes`
- `string`: `escapeHtml`, `unescapeHtml`, `template`, `words`, `mask`, `stripHtml`, `excerpt`
- Documentation for `date`, `delay`, `number`, `object`, and `string` utilities
- `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `PULL_REQUEST_TEMPLATE.md`, `SECURITY.md`
- MIT License

### Fixed
- `delay`: removed duplicate `setTimeout` in `delaySkippable`

### Security
- `randomId`: enhanced to use cryptographic randomness

## [0.1.2] - 2026-05-15

### Changed
- CI: switched to trusted publishing for npm releases

## [0.1.1] - 2026-05-14

### Added
- Initial release — core utility modules: `array`, `async`, `date`, `delay`, `number`, `object`, `string`

[0.1.6]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/zura-japoshvili/duckkit/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/zura-japoshvili/duckkit/releases/tag/v0.1.1
