# duckkit documentation

[← duckkit README](../README.md)

Every page lists a module's functions with their signature, examples, and notes on edge cases — what happens with empty input, `NaN`, time zones, Unicode, and so on. Every function can also be imported from the root: `import { groupBy } from 'duckkit'`.

## Modules

| Module | Import from | What's in it |
|--------|-------------|--------------|
| [Array](./array.md) | `duckkit/array` | `groupBy`, `partition`, `sortBy`, `topBy`, `chunk`, `unique`, set operations (`union`, `intersection`, `difference`), `countBy`, `keyBy`, `sum`, `sample`, `shuffle` |
| [Object](./object.md) | `duckkit/object` | `pick`, `omit`, `deepClone`, `deepMerge`, `isEqual`, `deepFreeze`, `flattenObject`, `mapKeys`, `mapValues`, `objectDiff`, `mergeIf`, typed `keys`/`entries` |
| [Async](./async.md) | `duckkit/async` | `safe`/`safeAsync` (errors as values), `memo`, `debounce`, `throttle`, `retry`, `timeout`, `once`, `defer`, `parallel`, `sequential`, `pipe` |
| [Date](./date.md) | `duckkit/date` | `formatDate`, `timeAgo`, `formatDuration`, `addDays`/`addMonths`/`addYears`, `daysBetween`, start/end of day/week/month, `isToday` and other checks |
| [Number](./number.md) | `duckkit/number` | `roundTo`, `truncateTo`, `clamp`, `lerp`, `normalize`, `randomInt`, `inRange`, `average`, `formatNumber`, `formatBytes`, `toOrdinal`, `toRoman` |
| [String](./string.md) | `duckkit/string` | case conversion, `slugify`, `truncate`, `excerpt`, `template`, `escapeHtml`, `mask`, `randomId`, `words` |
| [Delay](./delay.md) | `duckkit/delay` | `delay`, `delaySkippable`, `delayWithAbort`, `repeat` |
| [Emitter](./emitter.md) | `duckkit/emitter` | `createEmitter` — a typed event emitter |
| [Fn](./fn.md) | `duckkit/fn` | `pipeline`, `compose`, their async versions, `curry`, `tap`, `when` |
| [Encode](./encode.md) | `duckkit/encode` | Base64, Base64URL, hex, URI and JSON — decoders return `null` instead of throwing |
| [Validate](./validate.md) | `duckkit/validate` | `isEmail`, `isUrl`, `isUUID`, `isIP`, `isCreditCard`, `isPhone`, type guards, `isEmpty`, `isEnum` |

## Guides

- [Upgrading to 0.2](./upgrading-to-0.2.md) — what changed since 0.1.x and what, if anything, you need to do
- [Conventions](../README.md#conventions) — what every function has in common: no mutation, what throws, what returns `null`
- [Changelog](../CHANGELOG.md) — every release in detail

## Finding a function

- Not sure which module? Every function is listed, with links, in the [README table](../README.md#available-utilities).
- In your editor, hover a function: every one has JSDoc with examples.
