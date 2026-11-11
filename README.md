# duckkit 🦆

**Small, fully typed TypeScript utilities that get the edge cases right.**

Zero dependencies · tree-shakeable · ESM + CommonJS · every current browser and Node.js 20+

[![npm version](https://img.shields.io/npm/v/duckkit.svg)](https://www.npmjs.com/package/duckkit)
[![npm downloads](https://img.shields.io/npm/dm/duckkit.svg)](https://www.npmjs.com/package/duckkit)
[![CI](https://github.com/zura-japoshvili/duckkit/actions/workflows/ci.yml/badge.svg)](https://github.com/zura-japoshvili/duckkit/actions/workflows/ci.yml)
[![bundle size](https://img.shields.io/bundlephobia/minzip/duckkit)](https://bundlephobia.com/package/duckkit)
[![types included](https://img.shields.io/badge/types-included-blue)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/duckkit.svg)](https://github.com/zura-japoshvili/duckkit/blob/main/LICENSE)

150+ functions for arrays, objects, strings, numbers, dates, async code, events, encoding and validation. Each one is typed without `any`, documented together with its edge cases, and covered by tests (1,100+ in total).

```typescript
import { groupBy, roundTo, addMonths, slugify, safe } from 'duckkit'

groupBy(users, u => u.country)        // Partial<Record<'GE' | 'US', User[]>>
roundTo(1.005, 2)                     // 1.01 — Math.round(1.005 * 100) / 100 gives 1
addMonths(new Date(2026, 0, 31), 1)   // Feb 28 — Date#setMonth gives Mar 3
slugify('Café Résumé & Co')            // "cafe-resume-co"
safe(() => JSON.parse(raw))           // { ok: true, value } or { ok: false, error } — never throws
```

**Contents:** [Install](#install) · [Why duckkit](#why-duckkit) · [Examples](#examples) · [All functions](#available-utilities) · [Importing](#importing) · [Conventions](#conventions) · [Upgrading from 0.1](#upgrading-from-01x) · [Documentation](#documentation)

---

## Install

```bash
npm install duckkit
```

Works in every current browser and in Node.js 20+. Type declarations are included — there is no separate `@types` package.

---

## Why duckkit

**Types that tell the truth.** `groupBy` returns `Partial<Record<K, T[]>>`, so a group that may be missing is typed as possibly `undefined`. `safe` turns exceptions into a typed `Result`. The event emitter checks event names and payload types. `curry` types every step, for any number of arguments.

**Edge cases fixed, not footnoted.** `roundTo` rounds the decimal you wrote, so `1.005` becomes `1.01`. `addMonths` clamps to the end of the month and keeps the time of day across daylight-saving changes. `throttle` doesn't drop the last call. `truncate` never cuts an emoji in half.

**Not only A–Z.** `slugify`, `titleCase`, `camelCase` and the other string functions handle accented letters and every alphabet correctly — `slugify` turns `Café Résumé` into `cafe-resume`, where the usual regex gives `caf-rsum`.

**Small.** No dependencies, and the package is marked side-effect free, so bundlers keep only what you import: one function adds about 0.1–0.3 KB (minified and gzipped), the whole library about 7.5 KB.

**Checked as published.** CI installs the packed package the way users get it, loads every entry point with both `import` and `require`, and checks the type declarations with [publint](https://publint.dev) and [Are the Types Wrong](https://arethetypeswrong.github.io).

---

## Examples

### `groupBy` that knows which groups exist

```typescript
// lodash — returns Dictionary<User[]>: any string key compiles,
// and a group that may not exist is typed as always there
const grouped = _.groupBy(users, x => x.country)
grouped.GEE[0].name    // compiles — a typo that crashes at runtime

// duckkit — returns Partial<Record<"GE" | "US", User[]>>
const grouped = groupBy(users, x => x.country)
grouped.GE?.[0]?.name  // string | undefined ✅ — the type forces you to
                       // guard the key, since a group may be absent
grouped.GEE            // ❌ TypeScript error — not a known key
```

### Errors as values

```typescript
const result = safe(() => JSON.parse(raw))
if (result.ok) use(result.value)       // typed value
else console.error(result.error)       // always an Error, even if a string was thrown

const response = await safeAsync(() => fetch('/api/user'))
```

### Rounding and dates without surprises

```typescript
roundTo(1.005, 2)                        // 1.01
truncateTo(0.29, 2)                      // 0.29 — never rounds up, never drops a digit
formatBytes(1023.999)                    // "1 KB"

addMonths(new Date(2026, 0, 31), 1)      // 2026-02-28
addYears(new Date(2024, 1, 29), 1)       // 2025-02-28
```

### Strings in any language

```typescript
slugify('Café Résumé')                    // "cafe-resume"
slugify('Tom & Jerry: The Movie')         // "tom-jerry-the-movie"
titleCase("don't stop")                  // "Don't Stop"
camelCase('myAPIKey')                    // "myApiKey"
truncate('Hi😀there', 6)                 // "Hi..." — the emoji is not split
```

### Rate limiting you can cancel

```typescript
const save = debounce(() => saveDraft(), 1000)
window.addEventListener('beforeunload', () => save.flush())   // don't lose the last edit

const onScroll = throttle(() => updatePosition(), 100)
// runs at most every 100 ms, and once more after scrolling stops
onScroll.cancel()
```

### A typed event emitter

```typescript
const events = createEmitter<{
  win: number
  spin: void
}>()

events.on('win', amount => console.log(amount))   // amount: number
events.emit('win', 500)     // ✅
events.emit('win', 'oops')  // ❌ TypeScript error — payload must be a number
events.emit('wiiin', 500)   // ❌ TypeScript error — unknown event
```

### A wait the user can skip

```typescript
// resolves after 3 s, or as soon as the user clicks "skip"
await delaySkippable(3000, () => userClickedSkip)
```

---

## Available Utilities

Every name links to its documentation.

| Category | Functions |
|----------|-----------|
| **Array** | [`groupBy()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#groupby) [`flatGroupBy()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#flatgroupby) [`sortBy()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#sortby) [`topBy()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#topby) [`minBy()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#minby--maxby) [`maxBy()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#minby--maxby) [`partition()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#partition) [`chunk()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#chunk) [`unique()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#unique) [`zip()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#zip) [`flatten()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#flatten) [`range()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#range) [`compact()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#compact) [`sample()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#sample) [`shuffle()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#shuffle) [`without()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#without) [`union()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#union) [`intersection()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#intersection) [`difference()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#difference) [`countBy()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#countby) [`keyBy()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#keyby) [`sum()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#sum--sumby) [`sumBy()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md#sum--sumby) |
| **Object** | [`pick()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#pick) [`omit()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#omit) [`deepClone()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#deepclone) [`deepMerge()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#deepmerge) [`isEqual()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#isequal) [`mapKeys()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#mapkeys) [`mapValues()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#mapvalues) [`invertObject()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#invertobject) [`flattenObject()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#flattenobject) [`unflattenObject()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#unflattenobject) [`filterKeys()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#filterkeys) [`filterValues()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#filtervalues) [`keys()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#keys--values--entries--fromentries) [`values()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#keys--values--entries--fromentries) [`entries()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#keys--values--entries--fromentries) [`fromEntries()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#keys--values--entries--fromentries) [`deepFreeze()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#deepfreeze) [`objectDiff()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#objectdiff) [`mergeIf()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#mergeif) [`hasOwn()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md#hasown) |
| **Async** | [`safe()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#safe) [`safeAsync()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#safeasync) [`pipe()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#pipe) [`memo()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#memo) [`memoAsync()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#memoasync) [`debounce()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#debounce) [`throttle()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#throttle) [`retry()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#retry) [`timeout()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#timeout) [`once()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#once) [`defer()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#defer) [`parallel()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#parallel) [`sequential()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#sequential) |
| **Date** | [`timeAgo()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#timeago) [`formatDate()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#formatdate) [`formatDuration()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#formatduration) [`daysBetween()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#daysbetween) [`addDays()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#adddays) [`subDays()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#subdays) [`addMonths()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#addmonths) [`addYears()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#addyears) [`isBefore()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#isbefore--isafter) [`isAfter()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#isbefore--isafter) [`isSameDay()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#issameday) [`startOfDay()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#startofday--endofday) [`endOfDay()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#startofday--endofday) [`startOfWeek()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#startofweek) [`startOfMonth()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#startofmonth) [`isToday()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#boolean-date-checks) [`isYesterday()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#boolean-date-checks) [`isWeekend()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#boolean-date-checks) [`isThisWeek()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#boolean-date-checks) [`isThisYear()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md#boolean-date-checks) |
| **Number** | [`clamp()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/number.md#clamp) [`lerp()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/number.md#lerp) [`roundTo()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/number.md#roundto) [`truncateTo()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/number.md#truncateto) [`randomInt()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/number.md#randomint) [`inRange()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/number.md#inrange) [`average()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/number.md#average) [`normalize()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/number.md#normalize) [`toOrdinal()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/number.md#toordinal) [`toRoman()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/number.md#toroman) [`formatNumber()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/number.md#formatnumber) [`formatBytes()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/number.md#formatbytes) |
| **String** | [`capitalize()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#capitalize) [`truncate()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#truncate) [`excerpt()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#excerpt) [`slugify()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#slugify) [`camelCase()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#camelcase) [`snakeCase()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#snakecase) [`kebabCase()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#kebabcase) [`pascalCase()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#pascalcase) [`titleCase()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#titlecase) [`words()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#words) [`isEmpty()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#isempty) [`randomId()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#randomid) [`countOccurrences()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#countoccurrences) [`escapeHtml()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#escapehtml) [`unescapeHtml()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#unescapehtml) [`template()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#template) [`mask()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#mask) [`stripHtml()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md#striphtml) |
| **Delay** | [`delay()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/delay.md#delay) [`delaySkippable()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/delay.md#delayskippable) [`delayWithAbort()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/delay.md#delaywithabort) [`repeat()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/delay.md#repeat) |
| **Emitter** | [`createEmitter()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/emitter.md#createemitter) — with [`on()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/emitter.md#on) [`off()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/emitter.md#off) [`once()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/emitter.md#once) [`emit()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/emitter.md#emit) [`clear()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/emitter.md#clear) |
| **Encode** | [`encodeBase64()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/encode.md#encodebase64--decodebase64) [`decodeBase64()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/encode.md#encodebase64--decodebase64) [`encodeBase64Url()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/encode.md#encodebase64url--decodebase64url) [`decodeBase64Url()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/encode.md#encodebase64url--decodebase64url) [`encodeHex()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/encode.md#encodehex--decodehex) [`decodeHex()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/encode.md#encodehex--decodehex) [`encodeUri()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/encode.md#encodeuri--decodeuri) [`decodeUri()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/encode.md#encodeuri--decodeuri) [`encodeJson()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/encode.md#encodejson--decodejson) [`decodeJson()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/encode.md#encodejson--decodejson) |
| **Validate** | [`isEmail()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isemail) [`isUrl()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isurl) [`isUUID()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isuuid) [`isIP()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isip--isipv4--isipv6) [`isIPv4()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isip--isipv4--isipv6) [`isIPv6()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isip--isipv4--isipv6) [`isCreditCard()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#iscreditcard) [`isPhone()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isphone) [`isString()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isstring) [`isNumber()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isnumber) [`isBoolean()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isboolean) [`isArray()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isarray) [`isObject()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isobject) [`isDate()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isdate) [`isFunction()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isfunction) [`isNull()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isnull--isundefined--isnullorundefined) [`isUndefined()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isnull--isundefined--isnullorundefined) [`isNullOrUndefined()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isnull--isundefined--isnullorundefined) [`isPromise()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#ispromise) [`isEmpty()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isempty) [`isEmptyObject()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isemptyobject) [`isEnum()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isenum) [`isNaN()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isnan) [`isFinite()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md#isfinite) |
| **Fn** | [`pipeline()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/fn.md#pipeline) [`compose()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/fn.md#compose) [`pipelineAsync()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/fn.md#pipelineasync) [`composeAsync()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/fn.md#composeasync) [`curry()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/fn.md#curry) [`tap()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/fn.md#tap) [`when()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/fn.md#when) |
| **Result types** | `Result<T>`, `Ok<T>`, `Err` — returned by [`safe()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#safe) and [`safeAsync()`](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md#safeasync) |

---

## Importing

```typescript
// everything from the root — bundlers keep only what you use
import { groupBy, safe, slugify, roundTo } from 'duckkit'

// or per category
import { groupBy, partition, sortBy, chunk } from 'duckkit/array'
import { safe, safeAsync, debounce, throttle, retry, timeout } from 'duckkit/async'
import { formatDate, timeAgo, addMonths, startOfDay } from 'duckkit/date'
import { pick, omit, deepMerge, deepClone } from 'duckkit/object'
import { roundTo, truncateTo, formatBytes, clamp } from 'duckkit/number'
import { slugify, camelCase, truncate, template } from 'duckkit/string'
import { delay, delaySkippable, delayWithAbort, repeat } from 'duckkit/delay'
import { createEmitter } from 'duckkit/emitter'
import { pipeline, compose, curry, tap, when } from 'duckkit/fn'
import { encodeBase64, decodeBase64, encodeJson, decodeJson } from 'duckkit/encode'
import { isEmail, isUrl, isUUID, isString, isEnum } from 'duckkit/validate'

// types
import type { Result, Debounced, Throttled, Curried, DeepReadonly, Emitter } from 'duckkit'

// CommonJS works too
const { groupBy } = require('duckkit')
```

`isEmpty` exists in two versions: `duckkit` and `duckkit/validate` export the one that also handles arrays and objects, `duckkit/string` exports a string-only one.

---

## Conventions

- **Nothing mutates its input.** Functions return new arrays, objects and dates.
- **Decoders return `null` on bad input** (`decodeJson`, `decodeBase64`, …) instead of throwing.
- **Validators and type guards return booleans** (`isEmail`, `isString`, …); type guards also narrow the type.
- **Invalid options throw** an `Error` whose message starts with the function name, e.g. `roundTo: decimals must be an integer`.
- **Dates use local time**, like `Date` itself.
- **Strings are Unicode-aware**: letters from any script count as letters, and emoji are never split.

---

## Upgrading from 0.1.x

0.2.0 fixes the published package — several documented imports did not work in 0.1.x — and fixes bugs that were documented instead of fixed. Most code needs no change. Check these:

- **Stored slugs:** `slugify` now removes accents instead of dropping accented letters (`'Café'` → `'cafe'`, was `'caf'`) and keeps letters from other alphabets. Slugs you saved earlier from such text will differ if you regenerate them.
- **`throttle`** now runs the last call made during the wait. Pass `{ trailing: false }` for the old behavior.
- **`curry`** works for any number of arguments; drop explicit type arguments like `curry<number, number, number>(…)`.
- **Rounding and month math** give different (correct) results at the edges: `roundTo(1.005, 2)` is `1.01`, `addMonths(Jan 31, 1)` is Feb 28.
- **Node.js 20+** is required (browsers are not affected).

The [upgrade guide](https://github.com/zura-japoshvili/duckkit/blob/main/docs/upgrading-to-0.2.md) lists every change with what to do, and the [changelog](https://github.com/zura-japoshvili/duckkit/blob/main/CHANGELOG.md) has the details.

---

## Documentation

Each page lists the module's functions with signatures, examples and edge-case notes. Start at the [documentation index](https://github.com/zura-japoshvili/duckkit/blob/main/docs/README.md).

| Module | What's in it |
|--------|--------------|
| [Array](https://github.com/zura-japoshvili/duckkit/blob/main/docs/array.md) | grouping, sorting, set operations, chunking, sampling |
| [Object](https://github.com/zura-japoshvili/duckkit/blob/main/docs/object.md) | pick/omit, deep clone/merge/equal/freeze, flatten, mapping |
| [Async](https://github.com/zura-japoshvili/duckkit/blob/main/docs/async.md) | `Result` error handling, memoize, debounce/throttle, retry, timeout, concurrency |
| [Date](https://github.com/zura-japoshvili/duckkit/blob/main/docs/date.md) | formatting, relative time, date math, start/end of periods, checks |
| [Number](https://github.com/zura-japoshvili/duckkit/blob/main/docs/number.md) | rounding, clamping, interpolation, formatting numbers and bytes |
| [String](https://github.com/zura-japoshvili/duckkit/blob/main/docs/string.md) | case conversion, slugs, truncation, HTML escaping, templates |
| [Delay](https://github.com/zura-japoshvili/duckkit/blob/main/docs/delay.md) | promise delays: plain, skippable, abortable, repeating |
| [Emitter](https://github.com/zura-japoshvili/duckkit/blob/main/docs/emitter.md) | a typed event emitter |
| [Fn](https://github.com/zura-japoshvili/duckkit/blob/main/docs/fn.md) | `pipeline`, `compose`, `curry`, `tap`, `when` |
| [Encode](https://github.com/zura-japoshvili/duckkit/blob/main/docs/encode.md) | Base64, Base64URL, hex, URI and JSON encoding that never throws |
| [Validate](https://github.com/zura-japoshvili/duckkit/blob/main/docs/validate.md) | format validators, type guards, value checks |

---

## Contributing

Bug reports, ideas and pull requests are welcome — see [CONTRIBUTING](https://github.com/zura-japoshvili/duckkit/blob/main/.github/CONTRIBUTING.md). Changes are listed in the [changelog](https://github.com/zura-japoshvili/duckkit/blob/main/CHANGELOG.md).

## License

MIT — [Zura Japoshvili](https://github.com/zura-japoshvili)
