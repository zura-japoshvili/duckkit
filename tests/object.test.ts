import { describe, it, expect } from 'vitest'
import { pick, omit, deepMerge, mapKeys, mapValues } from '../src/object/index'

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