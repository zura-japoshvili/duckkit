# Object

```typescript
import { pick, omit, deepMerge, deepClone, isEqual, mapKeys, mapValues, invertObject, flattenObject, unflattenObject, filterKeys, filterValues, keys, values, entries, fromEntries } from 'duckkit/object'
```

All functions are non-mutating — they always return a new object.

---

## pick

Creates a new object with only the specified keys. Removed keys disappear from the type entirely.

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

Recursively merges two objects. Nested objects are merged, not replaced. Arrays are replaced.

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

`Date` values are preserved correctly — they are treated as leaf values, not plain objects:

```typescript
deepMerge({ createdAt: new Date('2026-01-01') }, { updatedAt: new Date('2026-05-20') })
// { createdAt: Date, updatedAt: Date } ✅
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
> If you only want to merge defined values, filter them out of override first:
>
> ```typescript
> deepMerge(base, filterValues(override, v => v !== undefined))
> ```

---

## deepClone

Creates a true deep clone. Preserves `Date` objects — unlike `JSON.parse(JSON.stringify(...))` which converts them to strings.

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

Handles: objects, arrays, dates, primitives, `null`, `undefined`.

Does not handle: circular references, functions, class instances, `Map`, `Set`. For those cases, use the native `structuredClone()` available in Node 17+ and modern browsers.

> **Symbol keys are silently dropped:** `Object.keys` does not return symbol-keyed properties, so any `Symbol`-keyed values on the original are absent from the clone with no error.
>
> ```typescript
> const sym = Symbol('id')
> const original = { name: 'Zura', [sym]: 42 }
> const clone = deepClone(original)
> clone[sym]  // undefined ❌ — symbol key is gone
> ```
>
> If you need symbol keys preserved, use `structuredClone()` instead.

---

## isEqual

Deep equality check. Handles primitives, objects, arrays, dates, `null`, `undefined`, and nested structures.

```typescript
isEqual(a: unknown, b: unknown): boolean
```

```typescript
isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })  // true
isEqual([1, 2, 3], [1, 2, 3])                             // true
isEqual(new Date('2026-01-01'), new Date('2026-01-01'))   // true
isEqual(null, null)                                        // true

isEqual({ a: 1 }, { a: 2 })        // false
isEqual({ a: 1 }, { a: 1, b: 2 })  // false — extra keys
isEqual(1, '1')                     // false — different types
isEqual(null, undefined)            // false
```

Does not handle circular references.

> **`Map` and `Set` produce false positives:** Both pass the `typeof === 'object'` branch and are compared by `Object.keys`, which returns `[]` for both. Any two `Map` or `Set` instances compare as equal regardless of their contents.
>
> ```typescript
> isEqual(new Map([['a', 1]]), new Map([['b', 2]]))  // true ❌ — wrong
> isEqual(new Set([1, 2, 3]), new Set([4, 5, 6]))    // true ❌ — wrong
> ```
>
> Same applies to `RegExp` — `/a/` and `/b/` compare as equal. Don't use `isEqual` with these types.

> **`NaN` returns `false`:** `NaN === NaN` is `false` in JavaScript, and `isEqual` doesn't special-case it.
>
> ```typescript
> isEqual(NaN, NaN)  // false ❌
> ```
>
> If you need `NaN`-safe equality, use `Object.is(a, b)` for primitives.

---

## mapKeys

Creates a new object with all keys transformed by a function. Values stay unchanged.

```typescript
mapKeys<T>(obj: Record<string, T>, fn: (key: string) => string): Record<string, T>
```

```typescript
mapKeys({ first_name: 'Zura', last_name: 'J' }, k => camelCase(k))
// { firstName: 'Zura', lastName: 'J' }

mapKeys({ a: 1, b: 2 }, k => k.toUpperCase())
// { A: 1, B: 2 }
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

If multiple keys have the same value, the last one wins.

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

Arrays are treated as leaf values — they are not flattened:

```typescript
flattenObject({ a: { b: [1, 2, 3] } })
// { 'a.b': [1, 2, 3] }
```

> **Keys containing dots break the round-trip with `unflattenObject`:** A key like `'a.b'` is indistinguishable from a nested `{ a: { b: ... } }` after flattening — both become `'a.b'`. Restoring via `unflattenObject` will produce the nested structure, not the original flat key.
>
> ```typescript
> const obj = { 'a.b': 1 }
> unflattenObject(flattenObject(obj))
> // { a: { b: 1 } } ❌ — not the same as the original
> ```
>
> Avoid dot characters in keys if you need the round-trip to be lossless.

> **Empty nested objects are silently dropped:** An empty object `{}` is recursed into but produces no keys, so it disappears from the result entirely.
>
> ```typescript
> flattenObject({ a: {}, b: 1 })
> // { b: 1 } — a is gone ⚠️
> ```

> **`Date` values are silently dropped:** Dates pass the plain-object check (`typeof date === 'object'`, not null, not array), are recursed into, and produce no keys. The date disappears from the output.
>
> ```typescript
> flattenObject({ createdAt: new Date() })
> // {} ❌ — date is gone
> ```
>
> Convert dates to strings or timestamps before flattening if you need them preserved.

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

They are true inverses of each other (for plain objects without dot keys, empty objects, or Date values):

```typescript
const original = { user: { name: 'Zura', address: { city: 'Tbilisi' } } }
unflattenObject(flattenObject(original))
// deep equals original ✅
```

> **Conflicting paths silently overwrite:** If a key and a dotted path starting with that key both exist, the primitive is replaced by the nested object with no error.
>
> ```typescript
> unflattenObject({ 'a': 1, 'a.b': 2 })
> // { a: { b: 2 } } — a: 1 is lost ❌
> ```
>
> Ensure your flat keys don't have both `'x'` and `'x.y'` present at the same time.

---

## filterKeys

Creates a new object keeping only keys that pass a predicate.

```typescript
filterKeys<T>(obj: Record<string, T>, predicate: (key: string) => boolean): Record<string, T>
```

```typescript
filterKeys({ _id: 1, name: 'Zura', _internal: 2 }, k => !k.startsWith('_'))
// { name: 'Zura' }

filterKeys(config, k => allowedKeys.includes(k))
```

Like `pick` but with a function instead of a fixed array of keys — useful when you don't know the keys upfront.

---

## filterValues

Creates a new object keeping only entries where the value passes a predicate.

```typescript
filterValues<T>(obj: Record<string, T>, predicate: (value: T, key: string) => boolean): Record<string, T>
```

```typescript
filterValues({ a: 1, b: null, c: 3 }, v => v !== null)
// { a: 1, c: 3 }

filterValues(scores, v => v > 0)
// only positive scores

// key is available as second argument
filterValues({ a: 1, b: 2, c: 3 }, (_, k) => k !== 'b')
// { a: 1, c: 3 }
```

---

## keys / values / entries / fromEntries

Typed versions of the native `Object` methods. The native versions return `string[]` or `[string, T][]`, losing literal key types. These return the actual key union type.

```typescript
keys<T>(obj: T): (keyof T)[]
values<T>(obj: T): T[keyof T][]
entries<T>(obj: T): [keyof T, T[keyof T]][]
fromEntries<K extends string, V>(entries: [K, V][]): Record<K, V>
```

```typescript
keys({ name: 'Zura', age: 25 })
// typed as ('name' | 'age')[] — not string[] ✅

values({ name: 'Zura', age: 25 })
// ['Zura', 25]

entries({ a: 1, b: 2 })
// [['a', 1], ['b', 2]] — typed as ['a' | 'b', number][] ✅

fromEntries([['name', 'Zura'], ['age', '25']])
// { name: 'Zura', age: '25' }
```

`entries` and `fromEntries` are inverses:

```typescript
fromEntries(entries(obj) as [string, number][])
// deep equals obj ✅
```

> **The type is a promise TypeScript can't enforce at runtime:** Due to structural typing, an object can carry more properties than its declared type. `keys`, `values`, and `entries` claim to return only the keys in `T`, but at runtime they return every key actually on the object — including extras that aren't in the type.
>
> ```typescript
> type User = { name: string }
> const user = { name: 'Zura', role: 'admin' } as User
>
> keys(user)  // ['name', 'role'] at runtime — typed as ('name')[] ⚠️
> ```
>
> This is the same tradeoff as the native typed wrappers in every TypeScript codebase — the better types are worth it, just don't write logic that depends on the key list being exhaustive.