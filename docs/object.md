# Object

```typescript
import { pick, omit, deepMerge, deepClone, isEqual, mapKeys, mapValues, invertObject, flattenObject, unflattenObject, filterKeys, filterValues, keys, values, entries, fromEntries, deepFreeze, objectDiff, mergeIf, hasOwn } from 'duckkit/object'
import type { DeepReadonly } from 'duckkit/object'
```

All functions are non-mutating — they always return a new object.

---

## pick

Creates a new object with only the specified keys. Removed keys disappear from the type entirely. Only own properties are picked. Inherited properties are skipped.

```typescript
pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>
```

```typescript
const user = { name: 'Zura', email: 'z@z.com', password: 'secret' }

pick(user, ['name', 'email'])
// { name: 'Zura', email: 'z@z.com' }
// type: { name: string, email: string } — password gone from type ✅
```

Empty keys array returns an empty object. Original is never mutated.

---

## omit

Creates a new object without the specified keys. Omitted keys disappear from the type.

```typescript
omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>
```

```typescript
omit(user, ['password'])
// { name: 'Zura', email: 'z@z.com' }
// result.password → TypeScript compile error ✅
```

Omitting no keys returns a copy of the full object.

---

## deepMerge

Recursively merges two objects. Nested plain objects are merged, not replaced. Arrays are replaced.

```typescript
deepMerge<T, U>(base: T, override: U): DeepMerge<T, U>
```

```typescript
deepMerge(
  { server: { port: 3000, host: 'localhost' }, debug: false },
  { server: { port: 8080 } }
)
// { server: { port: 8080, host: 'localhost' }, debug: false }
// host is preserved ✅ — original not mutated ✅
```

Arrays in `override` always replace arrays in `base`:

```typescript
deepMerge({ tags: [1, 2] }, { tags: [3] })
// { tags: [3] } — not [1, 2, 3]
```

`Date`, `Map`, `Set`, `RegExp`, and class instances are treated as leaf values — `override` replaces them rather than walking into them:

```typescript
deepMerge({ re: /a/ }, { re: /b/g })
// { re: /b/g } ✅ — not a broken merge of RegExp internals
```

If `override` has a primitive where `base` has an object, the primitive wins:

```typescript
deepMerge({ a: { b: 1 } }, { a: 42 })
// { a: 42 }
```

> **`undefined` in override silently clears base values:** Keys present in `override` with value `undefined` overwrite whatever was in `base`.
>
> ```typescript
> deepMerge({ name: 'Zura', role: 'admin' }, { role: undefined })
> // { name: 'Zura', role: undefined } — role is cleared ⚠️
> ```
>
> Use `mergeIf` if you want `undefined` to mean "leave alone", or filter the override first:
>
> ```typescript
> deepMerge(base, filterValues(override, v => v !== undefined))
> ```

---

## deepClone

Creates a true deep clone of plain objects, arrays, dates, and primitives. Preserves `Date` — unlike `JSON.parse(JSON.stringify(...))` which converts them to strings.

```typescript
deepClone<T>(value: T): T
```

```typescript
const original = { a: 1, b: { c: 2 }, createdAt: new Date() }
const clone = deepClone(original)

clone.b.c = 99
original.b.c               // still 2 ✅

clone.createdAt instanceof Date  // true ✅
JSON.parse(JSON.stringify(original)).createdAt instanceof Date  // false ❌
```

Handles: plain objects, arrays, dates, primitives, `null`, `undefined`.

> **Non-plain objects pass through by reference:** `Map`, `Set`, `RegExp`, and class instances are not deep-cloned — they are returned as-is. Mutations to them will affect the original.
>
> ```typescript
> const m = new Map([['a', 1]])
> const clone = deepClone({ data: m })
> clone.data === m  // true — same reference
> ```
>
> For full fidelity, use the native `structuredClone()` (Node 17+, modern browsers).

> **Symbol keys are silently dropped:** `Object.keys` does not return symbol-keyed properties.
>
> ```typescript
> const sym = Symbol('id')
> const original = { name: 'Zura', [sym]: 42 }
> deepClone(original)[sym]  // undefined ❌
> ```

> **Circular references will overflow the stack.**

---

## isEqual

Deep equality check. Handles primitives, objects, arrays, dates, regex, maps, sets, `null`, `undefined`, `NaN`, and nested structures.

```typescript
isEqual(a: unknown, b: unknown): boolean
```

```typescript
isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })   // true
isEqual([1, 2, 3], [1, 2, 3])                            // true
isEqual(new Date('2026-01-01'), new Date('2026-01-01'))  // true
isEqual(null, null)                                       // true

isEqual(NaN, NaN)                                         // true ✅
isEqual(new Map([['a', 1]]), new Map([['a', 1]]))         // true ✅
isEqual(new Set([1, 2, 3]), new Set([1, 2, 3]))           // true ✅
isEqual(/foo/g, /foo/g)                                   // true ✅

isEqual({ a: 1 }, { a: 2 })        // false
isEqual({ a: 1 }, { a: 1, b: 2 })  // false — extra keys
isEqual(1, '1')                     // false — different types
isEqual(null, undefined)            // false
```

> **Prototypes are compared:** A class instance and a plain object with the same own keys are not equal.
>
> ```typescript
> class User { constructor(public name: string) {} }
> isEqual(new User('Z'), { name: 'Z' })  // false ✅
> ```
>
> This is intentional — class instances have semantic meaning beyond their data.

> **Set comparison is by `SameValueZero`, not deep equality.** Two sets containing equivalent nested objects compare as not equal unless the references match.
>
> ```typescript
> isEqual(new Set([{ a: 1 }]), new Set([{ a: 1 }]))  // false — different references
> ```

> **Does not handle circular references.**

---

## mapKeys

Creates a new object with all keys transformed by a function. Values stay unchanged.

```typescript
mapKeys<T>(obj: Record<string, T>, fn: (key: string) => string): Record<string, T>
```

```typescript
mapKeys({ first_name: 'Zura', last_name: 'J' }, k => camelCase(k))
// { firstName: 'Zura', lastName: 'J' }
```

If two keys map to the same result, the last one wins.

---

## mapValues

Creates a new object with all values transformed by a function. Keys stay unchanged.

```typescript
mapValues<T, U>(obj: Record<string, T>, fn: (value: T, key: string) => U): Record<string, U>
```

```typescript
mapValues({ apple: 1.5, banana: 0.8 }, price => price * 0.9)
// { apple: 1.35, banana: 0.72 }

// key is available as second argument
mapValues({ a: 1, b: 2 }, (value, key) => `${key}=${value}`)
// { a: 'a=1', b: 'b=2' }
```

---

## invertObject

Flips the keys and values of an object.

```typescript
invertObject<K extends string, V extends string>(obj: Record<K, V>): Record<V, K>
```

```typescript
invertObject({ a: '1', b: '2', c: '3' })
// { '1': 'a', '2': 'b', '3': 'c' }

invertObject({ admin: 'ROLE_ADMIN', user: 'ROLE_USER' })
// { ROLE_ADMIN: 'admin', ROLE_USER: 'user' }
```

If multiple keys have the same value, the last one wins. Only string values are accepted at the type level — JavaScript would coerce other types to strings when used as keys anyway, but the type forces you to convert explicitly.

---

## flattenObject

Flattens a nested object into a single level using dot-notation keys.

```typescript
flattenObject(obj: Record<string, unknown>, prefix?: string): Record<string, unknown>
```

```typescript
flattenObject({ a: { b: { c: 1 }, d: 2 }, e: 3 })
// { 'a.b.c': 1, 'a.d': 2, 'e': 3 }

flattenObject({ user: { name: 'Zura', address: { city: 'Tbilisi' } } })
// { 'user.name': 'Zura', 'user.address.city': 'Tbilisi' }
```

Only plain objects are recursed into. Arrays, Dates, Maps, Sets, RegExp, and class instances are kept as leaf values:

```typescript
flattenObject({ a: { b: [1, 2, 3] } })       // { 'a.b': [1, 2, 3] }
flattenObject({ createdAt: new Date() })      // { createdAt: Date } ✅
flattenObject({ a: {}, b: 1 })                // { a: {}, b: 1 } ✅ — empty kept
```

> **Keys containing dots break the round-trip with `unflattenObject`:** A key like `'a.b'` is indistinguishable from a nested `{ a: { b: ... } }` after flattening — both become `'a.b'`.
>
> ```typescript
> const obj = { 'a.b': 1 }
> unflattenObject(flattenObject(obj))
> // { a: { b: 1 } } ❌ — not the same as the original
> ```
>
> Avoid dot characters in keys if you need the round-trip to be lossless.

---

## unflattenObject

Restores a flat dot-notation object back into a nested structure. The inverse of `flattenObject`.

```typescript
unflattenObject(obj: Record<string, unknown>): Record<string, unknown>
```

```typescript
unflattenObject({ 'a.b.c': 1, 'a.d': 2, 'e': 3 })
// { a: { b: { c: 1 }, d: 2 }, e: 3 }
```

Keys containing `__proto__`, `constructor`, or `prototype` segments are skipped entirely to prevent prototype pollution:

```typescript
unflattenObject({ '__proto__.polluted': true })
// {} — key skipped, Object.prototype unchanged ✅
```

This makes the function safe to use on untrusted input.

> **Conflicting paths silently overwrite:** If a key and a dotted path starting with that key both exist, the primitive is replaced by the nested object.
>
> ```typescript
> unflattenObject({ 'a': 1, 'a.b': 2 })
> // { a: { b: 2 } } — a: 1 is lost ⚠️
> ```

---

## filterKeys

Creates a new object keeping only keys that pass a predicate.

```typescript
filterKeys<T>(obj: Record<string, T>, predicate: (key: string) => boolean): Record<string, T>
```

```typescript
filterKeys({ _id: 1, name: 'Zura', _internal: 2 }, k => !k.startsWith('_'))
// { name: 'Zura' }
```

Like `pick` but with a function instead of a fixed array of keys.

---

## filterValues

Creates a new object keeping only entries where the value passes a predicate.

```typescript
filterValues<T>(obj: Record<string, T>, predicate: (value: T, key: string) => boolean): Record<string, T>
```

```typescript
filterValues({ a: 1, b: null, c: 3 }, v => v !== null)
// { a: 1, c: 3 }

// key is available as second argument
filterValues({ a: 1, b: 2, c: 3 }, (_, k) => k !== 'b')
// { a: 1, c: 3 }
```

---

## keys / values / entries / fromEntries

Typed versions of the native `Object` methods.

```typescript
keys<T>(obj: T): (keyof T)[]
values<T>(obj: T): T[keyof T][]
entries<T>(obj: T): [keyof T, T[keyof T]][]
fromEntries<K extends string, V>(entries: [K, V][]): Record<K, V>
```

```typescript
keys({ name: 'Zura', age: 25 })
// typed as ('name' | 'age')[] — not string[] ✅

entries({ a: 1, b: 2 })
// [['a', 1], ['b', 2]] — typed as ['a' | 'b', number][] ✅
```

> **The type is a promise TypeScript can't enforce at runtime:** Due to structural typing, an object can carry more properties than its declared type. At runtime these return every own enumerable key on the object — including extras not in the type.

---

## deepFreeze

Recursively freezes an object and all nested objects. Returns the object typed as `DeepReadonly<T>` — mutations are caught at compile time.

```typescript
deepFreeze<T extends object>(obj: T): DeepReadonly<T>
```

```typescript
const config = deepFreeze({ db: { host: 'localhost', port: 5432 } })

config.db.port = 9999   // TypeScript error ❌ — deeply readonly
```

Returns the same object reference. Arrays are frozen too. Already frozen objects are safe to pass.

> **Only own string-keyed properties are visited.** Symbol-keyed values are not frozen. The prototype chain is not frozen.

---

## objectDiff

Returns the keys that differ between two objects. A key is included if it was added, removed, or its value changed.

```typescript
objectDiff<T, U>(base: T, updated: U): string[]
```

```typescript
objectDiff({ a: 1, b: 2 }, { a: 1, b: 3, c: 4 })
// ['b', 'c']

objectDiff({ a: 1, b: 2 }, { a: 1 })
// ['b']
```

> **Shallow only:** Nested objects are compared by reference.
>
> ```typescript
> const obj = { a: { b: 1 } }
> objectDiff(obj, { a: obj.a })  // [] — same reference, no diff
> ```

---

## mergeIf

Shallow merge that skips keys where the override value is `null` or `undefined`. Base values are preserved when the override has nothing meaningful to contribute.

```typescript
mergeIf<T>(base: T, override: { [K in keyof T]?: T[K] | null | undefined }): T
```

```typescript
mergeIf({ name: 'Zura', role: 'admin' }, { name: 'Zurab', role: undefined })
// { name: 'Zurab', role: 'admin' } — role preserved ✅

mergeIf({ name: 'Zura', role: 'admin' }, { role: null })
// { name: 'Zura', role: 'admin' } — null is skipped too ✅

mergeIf({ a: 1 }, { a: 0 })
// { a: 0 } — 0 is kept, only null/undefined are skipped ✅
```

> **Shallow only:** Only top-level keys are processed. Nested objects are replaced, not recursively merged.

---

## hasOwn

Typed wrapper for `Object.hasOwn`. Returns `true` if the object has the specified key as its own property.

```typescript
hasOwn<T extends object>(obj: T, key: PropertyKey): key is keyof T
```

```typescript
hasOwn({ a: 1 }, 'a')       // true
hasOwn({}, 'toString')      // false — inherited, not own
hasOwn({ [sym]: 1 }, sym)   // true — works with symbol keys ✅
```

Safe even if `hasOwnProperty` has been shadowed on the object.