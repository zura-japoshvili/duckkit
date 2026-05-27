import { describe, it, expect } from 'vitest'
import { pick, omit, deepMerge, mapKeys, mapValues, deepFreeze, objectDiff, mergeIf, hasOwn } from '../src/object/index'
import { isEqual, deepClone } from '../src/object/index'
import { invertObject, flattenObject, unflattenObject, filterKeys, filterValues, keys, values, entries, fromEntries } from '../src/object/index'

describe('isEqual', () => {
  it('primitives — equal', () => expect(isEqual(1, 1)).toBe(true))
  it('primitives — not equal', () => expect(isEqual(1, 2)).toBe(false))
  it('strings', () => expect(isEqual('a', 'a')).toBe(true))
  it('null equals null', () => expect(isEqual(null, null)).toBe(true))
  it('null vs undefined', () => expect(isEqual(null, undefined)).toBe(false))
  it('flat objects equal', () => expect(isEqual({ a: 1 }, { a: 1 })).toBe(true))
  it('flat objects not equal', () => expect(isEqual({ a: 1 }, { a: 2 })).toBe(false))
  it('nested objects equal', () => expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true))
  it('nested objects not equal', () => expect(isEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false))
  it('arrays equal', () => expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true))
  it('arrays not equal', () => expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false))
  it('arrays different length', () => expect(isEqual([1, 2], [1, 2, 3])).toBe(false))
  it('dates equal', () => expect(isEqual(new Date('2026-01-01'), new Date('2026-01-01'))).toBe(true))
  it('dates not equal', () => expect(isEqual(new Date('2026-01-01'), new Date('2026-01-02'))).toBe(false))
  it('different types', () => expect(isEqual(1, '1')).toBe(false))
  it('extra keys make objects not equal', () => expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false))

  // New: NaN handling
  it('NaN equals NaN', () => expect(isEqual(NaN, NaN)).toBe(true))
  it('NaN does not equal number', () => expect(isEqual(NaN, 1)).toBe(false))

  // New: RegExp handling
  it('regex equal — same pattern and flags', () => expect(isEqual(/foo/g, /foo/g)).toBe(true))
  it('regex not equal — different source', () => expect(isEqual(/a/, /b/)).toBe(false))
  it('regex not equal — different flags', () => expect(isEqual(/a/g, /a/i)).toBe(false))

  // New: Map handling
  it('Map equal — same entries', () => {
    expect(isEqual(new Map([['a', 1]]), new Map([['a', 1]]))).toBe(true)
  })
  it('Map not equal — different values', () => {
    expect(isEqual(new Map([['a', 1]]), new Map([['a', 2]]))).toBe(false)
  })
  it('Map not equal — different keys', () => {
    expect(isEqual(new Map([['a', 1]]), new Map([['b', 1]]))).toBe(false)
  })
  it('Map not equal — different size', () => {
    expect(isEqual(new Map([['a', 1]]), new Map([['a', 1], ['b', 2]]))).toBe(false)
  })

  // New: Set handling
  it('Set equal — same items', () => {
    expect(isEqual(new Set([1, 2, 3]), new Set([1, 2, 3]))).toBe(true)
  })
  it('Set not equal — different items', () => {
    expect(isEqual(new Set([1, 2, 3]), new Set([4, 5, 6]))).toBe(false)
  })
  it('Set not equal — different size', () => {
    expect(isEqual(new Set([1, 2]), new Set([1, 2, 3]))).toBe(false)
  })

  // New: prototype check
  it('class instance not equal to plain object with same keys', () => {
    class User { constructor(public name: string) {} }
    expect(isEqual(new User('Z'), { name: 'Z' })).toBe(false)
  })

  // New: array vs object mismatch
  it('array not equal to object', () => {
    expect(isEqual([1, 2], { 0: 1, 1: 2 } as unknown)).toBe(false)
  })
})

describe('deepClone', () => {
  it('clones flat object', () => {
    const obj = { a: 1, b: 2 }
    const clone = deepClone(obj)
    expect(clone).toEqual(obj)
    expect(clone).not.toBe(obj)
  })

  it('clones nested object — mutation does not affect original', () => {
    const obj = { a: { b: 1 } }
    const clone = deepClone(obj)
    clone.a.b = 99
    expect(obj.a.b).toBe(1)
  })

  it('clones arrays', () => {
    const arr = [1, 2, [3, 4]]
    const clone = deepClone(arr)
    expect(clone).toEqual(arr)
    expect(clone).not.toBe(arr)
  })

  it('clones nested Date inside object', () => {
    const obj = { createdAt: new Date('2026-01-01') }
    const clone = deepClone(obj)
    expect(clone.createdAt).toEqual(obj.createdAt)
    expect(clone.createdAt).not.toBe(obj.createdAt)
    expect(clone.createdAt instanceof Date).toBe(true)
  })

  it('does not share array references in nested objects', () => {
    const obj = { tags: [1, 2, 3] }
    const clone = deepClone(obj)
    clone.tags.push(4)
    expect(obj.tags).toEqual([1, 2, 3])
  })

  it('handles null', () => expect(deepClone(null)).toBeNull())
  it('handles undefined', () => expect(deepClone(undefined)).toBeUndefined())
  it('handles primitives', () => expect(deepClone(42)).toBe(42))
  it('handles strings', () => expect(deepClone('hello')).toBe('hello'))

  // New: Map/Set/RegExp pass through (documented)
  it('Map passes through by reference', () => {
    const m = new Map([['a', 1]])
    expect(deepClone(m)).toBe(m)
  })
  it('Set passes through by reference', () => {
    const s = new Set([1, 2])
    expect(deepClone(s)).toBe(s)
  })

  // New: symbol keys are dropped (documented)
  it('drops symbol keys (documented limitation)', () => {
    const sym = Symbol('id')
    const obj = { name: 'Zura', [sym]: 42 }
    const clone = deepClone(obj) as Record<string | symbol, unknown>
    expect(clone[sym]).toBeUndefined()
  })
})

describe('pick', () => {
  it('picks specified keys', () => {
    const user = { name: 'Zura', email: 'z@z.com', password: 'secret' }
    expect(pick(user, ['name', 'email'])).toEqual({ name: 'Zura', email: 'z@z.com' })
  })

  it('ignores keys not in object', () => {
    const obj = { a: 1, b: 2 }
    expect(pick(obj, ['a'])).toEqual({ a: 1 })
  })

  it('picks all keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(pick(obj, ['a', 'b', 'c'])).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('returns empty object when picking no keys', () => {
    expect(pick({ a: 1, b: 2 }, [])).toEqual({})
  })

  it('does not mutate the original object', () => {
    const obj = { a: 1, b: 2 }
    pick(obj, ['a'])
    expect(obj).toEqual({ a: 1, b: 2 })
  })

  it('handles undefined values', () => {
    const obj = { a: undefined, b: 2 }
    expect(pick(obj, ['a'])).toEqual({ a: undefined })
  })

  // New: does not pick inherited properties
  it('does not pick inherited properties', () => {
    expect(pick({} as Record<string, unknown>, ['toString' as never])).toEqual({})
  })
})

describe('omit', () => {
  it('omits specified keys', () => {
    const user = { name: 'Zura', email: 'z@z.com', password: 'secret' }
    expect(omit(user, ['password'])).toEqual({ name: 'Zura', email: 'z@z.com' })
  })

  it('returns full object when omitting nothing', () => {
    const obj = { a: 1, b: 2 }
    expect(omit(obj, [])).toEqual({ a: 1, b: 2 })
  })

  it('omits multiple keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(omit(obj, ['a', 'c'])).toEqual({ b: 2 })
  })

  it('omits all keys returns empty object', () => {
    const obj = { a: 1, b: 2 }
    expect(omit(obj, ['a', 'b'])).toEqual({})
  })

  it('does not mutate the original object', () => {
    const obj = { a: 1, b: 2 }
    omit(obj, ['a'])
    expect(obj).toEqual({ a: 1, b: 2 })
  })
})

describe('deepMerge', () => {
  it('merges flat objects', () => {
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
  })

  it('overrides primitive values', () => {
    expect(deepMerge({ a: 1, b: 2 }, { b: 99 })).toEqual({ a: 1, b: 99 })
  })

  it('deep merges nested objects', () => {
    const base = { theme: { color: 'red', size: 12 } }
    const override = { theme: { color: 'blue' } }
    expect(deepMerge(base, override)).toEqual({ theme: { color: 'blue', size: 12 } })
  })

  it('replaces arrays not merges them', () => {
    expect(deepMerge({ arr: [1, 2] }, { arr: [3] })).toEqual({ arr: [3] })
  })

  it('adds new keys from override', () => {
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
  })

  it('handles deeply nested objects', () => {
    const base = { a: { b: { c: 1 } } }
    const override = { a: { b: { d: 2 } } }
    expect(deepMerge(base, override)).toEqual({ a: { b: { c: 1, d: 2 } } })
  })

  it('override with empty object keeps base', () => {
    expect(deepMerge({ a: 1, b: 2 }, {})).toEqual({ a: 1, b: 2 })
  })

  it('base empty object returns override', () => {
    expect(deepMerge({}, { a: 1 })).toEqual({ a: 1 })
  })

  it('does not mutate base object', () => {
    const base = { a: 1, b: { c: 2 } }
    deepMerge(base, { b: { c: 99 } })
    expect(base.b.c).toBe(2)
  })

  it('primitive in override replaces nested object in base', () => {
    expect(deepMerge({ a: { b: 1 } }, { a: 42 })).toEqual({ a: 42 })
  })

  // New: non-plain objects are leaf values
  it('Date in override replaces Date in base — not merged', () => {
    const a = new Date('2026-01-01')
    const b = new Date('2026-05-22')
    expect(deepMerge({ d: a }, { d: b }).d).toBe(b)
  })

  it('RegExp is replaced not merged', () => {
    const result = deepMerge({ re: /a/ }, { re: /b/g })
    expect(result.re).toEqual(/b/g)
  })

  it('Map in override replaces Map in base', () => {
    const m1 = new Map([['a', 1]])
    const m2 = new Map([['b', 2]])
    expect(deepMerge({ m: m1 }, { m: m2 }).m).toBe(m2)
  })

  // New: undefined in override clears base value (documented footgun)
  it('undefined in override clears base value', () => {
    expect(deepMerge({ a: 1 } as { a: number | undefined }, { a: undefined }))
      .toEqual({ a: undefined })
  })
})

describe('mapKeys', () => {
  it('transforms keys', () => {
    expect(mapKeys({ first_name: 'Zura' }, k => k.replace('_', ''))).toEqual({ firstname: 'Zura' })
  })

  it('preserves values', () => {
    expect(mapKeys({ a: 1, b: 2 }, k => k.toUpperCase())).toEqual({ A: 1, B: 2 })
  })

  it('handles empty object', () => {
    expect(mapKeys({}, k => k.toUpperCase())).toEqual({})
  })

  it('identity fn returns same keys', () => {
    expect(mapKeys({ a: 1 }, k => k)).toEqual({ a: 1 })
  })

  it('two keys mapping to same result — last one wins', () => {
    expect(mapKeys({ a: 1, b: 2 }, () => 'same')).toEqual({ same: 2 })
  })
})

describe('mapValues', () => {
  it('transforms values', () => {
    expect(mapValues({ apple: 1.5, banana: 0.8 }, v => Math.round(v * 0.9 * 100) / 100))
      .toEqual({ apple: 1.35, banana: 0.72 })
  })

  it('passes key to the transformer', () => {
    expect(mapValues({ a: 1 }, (v, k) => `${k}:${v}`)).toEqual({ a: 'a:1' })
  })

  it('handles empty object', () => {
    expect(mapValues({}, v => v)).toEqual({})
  })

  it('can change value type', () => {
    expect(mapValues({ a: 1, b: 2 }, v => String(v))).toEqual({ a: '1', b: '2' })
  })

  it('does not mutate the original object', () => {
    const obj = { a: 1 }
    mapValues(obj, v => v * 10)
    expect(obj).toEqual({ a: 1 })
  })

  it('identity fn returns same values', () => {
    expect(mapValues({ a: 1, b: 2 }, v => v)).toEqual({ a: 1, b: 2 })
  })
})

describe('invertObject', () => {
  it('flips keys and values', () => {
    expect(invertObject({ a: '1', b: '2', c: '3' })).toEqual({ '1': 'a', '2': 'b', '3': 'c' })
  })

  it('handles empty object', () => {
    expect(invertObject({})).toEqual({})
  })

  it('last value wins on duplicate values', () => {
    expect(invertObject({ a: 'x', b: 'x' })).toEqual({ x: 'b' })
  })

  it('works with role maps', () => {
    const roles = { admin: 'ROLE_ADMIN', user: 'ROLE_USER' }
    expect(invertObject(roles)).toEqual({ ROLE_ADMIN: 'admin', ROLE_USER: 'user' })
  })
})

describe('flattenObject', () => {
  it('flattens nested object', () => {
    expect(flattenObject({ a: { b: { c: 1 }, d: 2 }, e: 3 }))
      .toEqual({ 'a.b.c': 1, 'a.d': 2, 'e': 3 })
  })

  it('handles already flat object', () => {
    expect(flattenObject({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 })
  })

  it('handles empty object', () => {
    expect(flattenObject({})).toEqual({})
  })

  it('preserves arrays as values — does not flatten them', () => {
    expect(flattenObject({ a: { b: [1, 2, 3] } })).toEqual({ 'a.b': [1, 2, 3] })
  })

  it('handles deeply nested object', () => {
    expect(flattenObject({ a: { b: { c: { d: 1 } } } })).toEqual({ 'a.b.c.d': 1 })
  })

  // New: Date preserved
  it('preserves Date as leaf value', () => {
    const d = new Date('2026-01-01')
    expect(flattenObject({ createdAt: d })).toEqual({ createdAt: d })
  })

  // New: Map preserved
  it('preserves Map as leaf value', () => {
    const m = new Map([['a', 1]])
    expect(flattenObject({ data: m })).toEqual({ data: m })
  })

  // New: empty nested objects preserved
  it('preserves empty nested objects', () => {
    expect(flattenObject({ a: {}, b: 1 })).toEqual({ a: {}, b: 1 })
  })
})

describe('unflattenObject', () => {
  it('restores nested structure', () => {
    expect(unflattenObject({ 'a.b.c': 1, 'a.d': 2, 'e': 3 }))
      .toEqual({ a: { b: { c: 1 }, d: 2 }, e: 3 })
  })

  it('handles already flat keys', () => {
    expect(unflattenObject({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 })
  })

  it('handles empty object', () => {
    expect(unflattenObject({})).toEqual({})
  })

  it('flattenObject and unflattenObject are inverses', () => {
    const original = { user: { name: 'Zura', address: { city: 'Tbilisi' } } }
    expect(unflattenObject(flattenObject(original))).toEqual(original)
  })

  // New: prototype pollution prevention
  it('blocks __proto__ pollution', () => {
    const before = (Object.prototype as Record<string, unknown>).polluted
    unflattenObject({ '__proto__.polluted': true })
    expect((Object.prototype as Record<string, unknown>).polluted).toBe(before)
  })

  it('blocks constructor.prototype pollution', () => {
    const before = (Object.prototype as Record<string, unknown>).polluted2
    unflattenObject({ 'constructor.prototype.polluted2': true })
    expect((Object.prototype as Record<string, unknown>).polluted2).toBe(before)
  })

  it('blocks prototype segment', () => {
    const result = unflattenObject({ 'a.prototype.x': 1, 'b': 2 })
    expect(result).toEqual({ b: 2 })
  })
})

describe('filterKeys', () => {
  it('keeps keys matching predicate', () => {
    expect(filterKeys({ _id: 1, name: 'Zura', _internal: 2 }, k => !k.startsWith('_')))
      .toEqual({ name: 'Zura' })
  })

  it('returns empty when nothing matches', () => {
    expect(filterKeys({ a: 1, b: 2 }, () => false)).toEqual({})
  })

  it('returns all when everything matches', () => {
    expect(filterKeys({ a: 1, b: 2 }, () => true)).toEqual({ a: 1, b: 2 })
  })

  it('handles empty object', () => {
    expect(filterKeys({}, () => true)).toEqual({})
  })

  it('does not mutate the original', () => {
    const obj = { a: 1, b: 2 }
    filterKeys(obj, k => k === 'a')
    expect(obj).toEqual({ a: 1, b: 2 })
  })
})

describe('filterValues', () => {
  it('keeps values matching predicate', () => {
    expect(filterValues({ a: 1, b: null, c: 3 } as Record<string, number | null>, v => v !== null))
      .toEqual({ a: 1, c: 3 })
  })

  it('returns empty when nothing matches', () => {
    expect(filterValues({ a: 1, b: 2 }, v => v > 10)).toEqual({})
  })

  it('returns all when everything matches', () => {
    expect(filterValues({ a: 1, b: 2 }, v => v > 0)).toEqual({ a: 1, b: 2 })
  })

  it('handles empty object', () => {
    expect(filterValues({}, () => true)).toEqual({})
  })

  it('passes key to predicate', () => {
    expect(filterValues({ a: 1, b: 2, c: 3 }, (_, k) => k !== 'b'))
      .toEqual({ a: 1, c: 3 })
  })

  it('does not mutate the original', () => {
    const obj = { a: 1, b: 2 }
    filterValues(obj, v => v > 1)
    expect(obj).toEqual({ a: 1, b: 2 })
  })
})

describe('keys', () => {
  it('returns array of keys', () => {
    expect(keys({ a: 1, b: 2 })).toEqual(['a', 'b'])
  })

  it('handles empty object', () => {
    expect(keys({})).toEqual([])
  })
})

describe('values', () => {
  it('returns array of values', () => {
    expect(values({ a: 1, b: 2 })).toEqual([1, 2])
  })

  it('handles empty object', () => {
    expect(values({})).toEqual([])
  })
})

describe('entries', () => {
  it('returns array of [key, value] pairs', () => {
    expect(entries({ a: 1, b: 2 })).toEqual([['a', 1], ['b', 2]])
  })

  it('handles empty object', () => {
    expect(entries({})).toEqual([])
  })
})

describe('fromEntries', () => {
  it('builds object from entries', () => {
    expect(fromEntries([['name', 'Zura'], ['age', '25']])).toEqual({ name: 'Zura', age: '25' })
  })

  it('handles empty array', () => {
    expect(fromEntries([])).toEqual({})
  })

  it('is inverse of entries', () => {
    const obj = { a: 1, b: 2 }
    expect(fromEntries(entries(obj) as [string, number][])).toEqual(obj)
  })
})

describe('deepFreeze', () => {
  it('freezes top-level object', () => {
    const obj = deepFreeze({ a: 1 })
    expect(() => { (obj as Record<string, unknown>).a = 99 }).toThrow()
  })

  it('freezes nested objects', () => {
    const obj = deepFreeze({ a: { b: 1 } })
    expect(() => { (obj.a as Record<string, unknown>).b = 99 }).toThrow()
  })

  it('returns the same reference', () => {
    const obj = { a: 1 }
    expect(deepFreeze(obj)).toBe(obj)
  })

  it('works with arrays', () => {
    const obj = deepFreeze({ tags: [1, 2, 3] })
    expect(Object.isFrozen(obj.tags)).toBe(true)
  })

  it('already frozen object does not throw', () => {
    const obj = Object.freeze({ a: 1 })
    expect(() => deepFreeze(obj)).not.toThrow()
  })

  it('deeply nested freezing works', () => {
    const obj = deepFreeze({ a: { b: { c: 1 } } })
    expect(Object.isFrozen(obj.a.b)).toBe(true)
  })
})

describe('objectDiff', () => {
  it('returns changed keys', () => {
    const diff = objectDiff({ a: 1, b: 2 }, { a: 1, b: 3 })
    expect(diff).toContain('b')
    expect(diff).not.toContain('a')
  })

  it('returns added keys', () => {
    const diff = objectDiff({ a: 1 }, { a: 1, b: 2 })
    expect(diff).toContain('b')
  })

  it('returns removed keys', () => {
    const diff = objectDiff({ a: 1, b: 2 }, { a: 1 })
    expect(diff).toContain('b')
  })

  it('returns empty array when objects are equal', () => {
    expect(objectDiff({ a: 1, b: 2 }, { a: 1, b: 2 })).toEqual([])
  })

  it('handles empty objects', () => {
    expect(objectDiff({}, {})).toEqual([])
  })

  it('detects undefined vs value change', () => {
    const diff = objectDiff({ a: 1 }, { a: undefined })
    expect(diff).toContain('a')
  })

  it('detects null vs value change', () => {
    const diff = objectDiff({ a: 1 }, { a: null })
    expect(diff).toContain('a')
  })

  it('returns multiple changed keys', () => {
    const diff = objectDiff({ a: 1, b: 2, c: 3 }, { a: 9, b: 9, c: 3 })
    expect(diff).toContain('a')
    expect(diff).toContain('b')
    expect(diff).not.toContain('c')
  })

  // New: shallow only (documented)
  it('does not detect changes inside nested objects (shallow)', () => {
    const obj = { a: { b: 1 } }
    expect(objectDiff(obj, { a: obj.a })).toEqual([])
  })
})

describe('mergeIf', () => {
  it('merges defined values', () => {
    expect(mergeIf({ a: 1, b: 2 }, { b: 99 })).toEqual({ a: 1, b: 99 })
  })

  it('skips undefined values', () => {
    expect(mergeIf({ a: 1, b: 2 }, { b: undefined })).toEqual({ a: 1, b: 2 })
  })

  it('skips null values', () => {
    expect(mergeIf({ a: 1, b: 2 }, { b: null as never })).toEqual({ a: 1, b: 2 })
  })

  it('adds new keys from override', () => {
    const result = mergeIf<Record<string, unknown>>({ a: 1 }, { b: 2 })
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('does not mutate base', () => {
    const base = { a: 1, b: 2 }
    mergeIf(base, { b: 99 })
    expect(base.b).toBe(2)
  })

  it('handles empty override', () => {
    expect(mergeIf({ a: 1 }, {})).toEqual({ a: 1 })
  })

  it('handles empty base', () => {
    expect(mergeIf<Record<string, unknown>>({}, { a: 1 })).toEqual({ a: 1 })
  })

  it('0 and false are kept — only null/undefined skipped', () => {
    expect(mergeIf({ a: 1, b: 2 }, { a: 0, b: false as never })).toEqual({ a: 0, b: false })
  })

  // New: shallow only (documented)
  it('is shallow — nested objects replaced not merged', () => {
    const result = mergeIf<Record<string, unknown>>(
      { theme: { color: 'red', size: 12 } },
      { theme: { color: 'blue' } }
    )
    expect(result.theme).toEqual({ color: 'blue' })
  })
})

describe('hasOwn', () => {
  it('returns true for own key', () => expect(hasOwn({ a: 1 }, 'a')).toBe(true))
  it('returns false for missing key', () => expect(hasOwn({ a: 1 }, 'b')).toBe(false))
  it('returns false for inherited key', () => expect(hasOwn({}, 'toString')).toBe(false))
  it('returns false for empty object', () => expect(hasOwn({}, 'a')).toBe(false))

  it('works with symbol keys', () => {
    const sym = Symbol('id')
    expect(hasOwn({ [sym]: 1 }, sym)).toBe(true)
  })

  it('works with undefined value — key still exists', () => {
    expect(hasOwn({ a: undefined }, 'a')).toBe(true)
  })

  it('works with null value — key still exists', () => {
    expect(hasOwn({ a: null }, 'a')).toBe(true)
  })

  it('works on object with overridden hasOwnProperty', () => {
    const obj = { hasOwnProperty: () => false, a: 1 }
    expect(hasOwn(obj, 'a')).toBe(true)
  })
})