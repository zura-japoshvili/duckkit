# Validate

[← duckkit README](../README.md) · [All docs](./README.md)

Format validators, type guards and value checks. Every function returns a boolean; the type guards also narrow the type.

```typescript
import { isEmail, isUrl, isUUID, isIP, isCreditCard, isPhone } from 'duckkit/validate'
import { isString, isNumber, isBoolean, isArray, isObject, isDate, isFunction } from 'duckkit/validate'
import { isNull, isUndefined, isNullOrUndefined, isPromise } from 'duckkit/validate'
import { isEmpty, isEmptyObject, isEnum } from 'duckkit/validate'
```

All functions return `boolean`. No throwing, no side effects.

**On this page:** [Format Validators](#format-validators) · [isEmail](#isemail) · [isUrl](#isurl) · [isUUID](#isuuid) · [isIP / isIPv4 / isIPv6](#isip--isipv4--isipv6) · [isCreditCard](#iscreditcard) · [isPhone](#isphone) · [Type Guards](#type-guards) · [isString](#isstring) · [isNumber](#isnumber) · [isBoolean](#isboolean) · [isArray](#isarray) · [isObject](#isobject) · [isDate](#isdate) · [isFunction](#isfunction) · [isNull / isUndefined / isNullOrUndefined](#isnull--isundefined--isnullorundefined) · [isPromise](#ispromise) · [Value Checks](#value-checks) · [isEmpty](#isempty) · [isEmptyObject](#isemptyobject) · [isEnum](#isenum) · [isNaN](#isnan) · [isFinite](#isfinite)

---

## Format Validators

### isEmail

```typescript
isEmail(value: string): boolean
```

```typescript
isEmail('z@z.com')         // true
isEmail('user@mail.co.uk') // true
isEmail('notanemail')      // false
isEmail('z@')              // false
```

---

### isUrl

```typescript
isUrl(value: string): boolean
```

Accepts `http` and `https` only.

```typescript
isUrl('https://github.com')  // true
isUrl('ftp://example.com')   // false — only http/https
isUrl('github.com')          // false — missing protocol
```

---

### isUUID

```typescript
isUUID(value: string): boolean
```

Validates UUID v4. Case insensitive.

```typescript
isUUID('550e8400-e29b-41d4-a716-446655440000')  // true
isUUID('not-a-uuid')                             // false
```

---

### isIP / isIPv4 / isIPv6

```typescript
isIP(value: string): boolean    // v4 or v6
isIPv4(value: string): boolean
isIPv6(value: string): boolean
```

```typescript
isIP('192.168.1.1')  // true — IPv4
isIP('::1')          // true — IPv6
isIPv4('256.0.0.1') // false — out of range
```

---

### isCreditCard

```typescript
isCreditCard(value: string): boolean
```

Uses the Luhn algorithm. Accepts spaces and dashes.

```typescript
isCreditCard('4242424242424242')     // true
isCreditCard('4242 4242 4242 4242')  // true
isCreditCard('1234567890123456')     // false
```

---

### isPhone

```typescript
isPhone(value: string): boolean
```

Accepts `+`, spaces, dashes, parentheses. Requires at least 7 digits.

```typescript
isPhone('+1 (555) 123-4567')  // true
isPhone('555-123-4567')       // true
isPhone('123')                // false — too short
```

---

## Type Guards

All type guards narrow the TypeScript type in `if` blocks.

### isString

```typescript
isString(value: unknown): value is string
```

```typescript
isString('hello')  // true
isString(42)       // false
```

---

### isNumber

```typescript
isNumber(value: unknown): value is number
```

Returns `false` for `NaN`.

```typescript
isNumber(42)   // true
isNumber(NaN)  // false ✅
isNumber('42') // false
```

---

### isBoolean

```typescript
isBoolean(value: unknown): value is boolean
```

```typescript
isBoolean(true)   // true
isBoolean(false)  // true
isBoolean(0)      // false
```

---

### isArray

```typescript
isArray(value: unknown): value is unknown[]
```

```typescript
isArray([1, 2, 3])  // true
isArray([])         // true
isArray({})         // false
```

---

### isObject

```typescript
isObject(value: unknown): value is Record<string, unknown>
```

Returns `true` only for plain objects — not arrays, not null, not class instances.

```typescript
isObject({ a: 1 })    // true
isObject([])          // false
isObject(null)        // false
isObject(new Date())  // false
```

---

### isDate

```typescript
isDate(value: unknown): value is Date
```

Returns `false` for `Invalid Date`.

```typescript
isDate(new Date())           // true
isDate(new Date('invalid'))  // false ✅
isDate('2026-01-01')         // false
```

---

### isFunction

```typescript
isFunction(value: unknown): value is Function
```

```typescript
isFunction(() => {})  // true
isFunction({})        // false
```

---

### isNull / isUndefined / isNullOrUndefined

```typescript
isNull(value: unknown): value is null
isUndefined(value: unknown): value is undefined
isNullOrUndefined(value: unknown): value is null | undefined
```

```typescript
isNull(null)               // true
isNull(undefined)          // false

isUndefined(undefined)     // true
isUndefined(null)          // false

isNullOrUndefined(null)    // true
isNullOrUndefined(undefined) // true
isNullOrUndefined(0)       // false
isNullOrUndefined('')      // false
```

---

### isPromise

```typescript
isPromise(value: unknown): value is Promise<unknown>
```

```typescript
isPromise(Promise.resolve())   // true
isPromise({ then: () => {} })  // false — thenable but not a Promise
```

---

## Value Checks

### isEmpty

```typescript
isEmpty(value: string | unknown[] | Record<string, unknown>): boolean
```

Works on strings, arrays, and objects.

```typescript
isEmpty('')         // true
isEmpty('   ')      // true — whitespace only
isEmpty([])         // true
isEmpty({})         // true
isEmpty('hello')    // false
isEmpty([1])        // false
isEmpty({ a: 1 })   // false
```

---

### isEmptyObject

```typescript
isEmptyObject(value: Record<string, unknown>): boolean
```

```typescript
isEmptyObject({})               // true
isEmptyObject({ a: 1 })         // false
isEmptyObject({ a: undefined }) // false — key exists
```

---

## isEnum

```typescript
isEnum<T extends Record<string, string | number>>(value: unknown, enumObj: T): value is T[keyof T]
```

Returns `true` if the value is one of the enum's **values** — not keys.

```typescript
enum Direction { Up = 'UP', Down = 'DOWN' }

isEnum('UP', Direction)   // true
isEnum('LEFT', Direction) // false
isEnum('Up', Direction)   // false — 'Up' is a key, not a value

enum Status { Active = 1, Inactive = 2 }

isEnum(1, Status)   // true
isEnum(99, Status)  // false
```

---

## isNaN

```typescript
isNaN(value: unknown): boolean
```

Returns `true` only if the value is exactly `NaN`. Unlike native `isNaN`, does not coerce strings.

```typescript
isNaN(NaN)        // true
isNaN(undefined)  // false ✅ — native isNaN returns true
isNaN('hello')    // false ✅ — native isNaN returns true
isNaN(42)         // false
isNaN(null)       // false
```

> **Use this instead of native `isNaN`:** The native `isNaN` coerces the value to a number first — `isNaN('hello')` returns `true` because `Number('hello')` is `NaN`. This function uses `Number.isNaN` which has no coercion.

---

## isFinite

```typescript
isFinite(value: unknown): boolean
```

Returns `true` only if the value is a finite number. Unlike native `isFinite`, does not coerce strings.

```typescript
isFinite(42)        // true
isFinite(3.14)      // true
isFinite(Infinity)  // false
isFinite(-Infinity) // false
isFinite(NaN)       // false
isFinite('42')      // false ✅ — native isFinite returns true
isFinite(null)      // false ✅ — native isFinite returns true
```

> **Use this instead of native `isFinite`:** The native `isFinite` coerces the value — `isFinite('42')` returns `true`. This function uses `Number.isFinite` which has no coercion.