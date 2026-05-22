import { describe, it, expect } from 'vitest'
import {
  encodeBase64, decodeBase64,
  encodeBase64Url, decodeBase64Url,
  encodeHex, decodeHex,
  encodeUri, decodeUri,
  encodeJson, decodeJson,
} from '../src/encode/index'

// ─── Base64 ───────────────────────────────────────────────────────────────────

describe('encodeBase64', () => {
  it('encodes a simple string', () => expect(encodeBase64('hello world')).toBe('aGVsbG8gd29ybGQ='))
  it('encodes empty string', () => expect(encodeBase64('')).toBe(''))
  it('encodes unicode', () => expect(typeof encodeBase64('Zura 🦆')).toBe('string'))
  it('round-trips with decodeBase64', () => {
    const original = 'Hello, TypeScript!'
    expect(decodeBase64(encodeBase64(original))).toBe(original)
  })
})

describe('decodeBase64', () => {
  it('decodes a valid Base64 string', () => expect(decodeBase64('aGVsbG8gd29ybGQ=')).toBe('hello world'))
  it('returns null for invalid input', () => expect(decodeBase64('!!!invalid')).toBeNull())
  it('returns empty string for empty input', () => expect(decodeBase64('')).toBe(''))
})

// ─── Base64URL ────────────────────────────────────────────────────────────────

describe('encodeBase64Url', () => {
  it('produces URL-safe output — no +, /, =', () => {
    const result = encodeBase64Url('hello world')
    expect(result).not.toContain('+')
    expect(result).not.toContain('/')
    expect(result).not.toContain('=')
  })

  it('round-trips with decodeBase64Url', () => {
    const original = 'TypeScript is great!'
    expect(decodeBase64Url(encodeBase64Url(original))).toBe(original)
  })

  it('encodes empty string', () => expect(encodeBase64Url('')).toBe(''))
})

describe('decodeBase64Url', () => {
  it('decodes a valid Base64URL string', () => {
    expect(decodeBase64Url('aGVsbG8gd29ybGQ')).toBe('hello world')
  })

  it('returns null for invalid input', () => expect(decodeBase64Url('!!!invalid')).toBeNull())
})

// ─── Hex ──────────────────────────────────────────────────────────────────────

describe('encodeHex', () => {
  it('encodes a string to hex', () => expect(encodeHex('hello')).toBe('68656c6c6f'))
  it('encodes empty string', () => expect(encodeHex('')).toBe(''))
  it('output is lowercase hex', () => expect(encodeHex('A')).toBe('41'))
  it('round-trips with decodeHex', () => {
    const original = 'duckkit'
    expect(decodeHex(encodeHex(original))).toBe(original)
  })
})

describe('decodeHex', () => {
  it('decodes a valid hex string', () => expect(decodeHex('68656c6c6f')).toBe('hello'))
  it('returns null for odd-length input', () => expect(decodeHex('abc')).toBeNull())
  it('returns null for non-hex characters', () => expect(decodeHex('zzzz')).toBeNull())
  it('returns empty string for empty input', () => expect(decodeHex('')).toBe(''))
  it('is case-insensitive', () => expect(decodeHex('68656C6C6F')).toBe('hello'))
})

// ─── URI ──────────────────────────────────────────────────────────────────────

describe('encodeUri', () => {
  it('encodes spaces', () => expect(encodeUri('hello world')).toBe('hello%20world'))
  it('encodes special characters', () => expect(encodeUri('a&b=c')).toBe('a%26b%3Dc'))
  it('encodes empty string', () => expect(encodeUri('')).toBe(''))
  it('round-trips with decodeUri', () => {
    const original = 'hello world & more!'
    expect(decodeUri(encodeUri(original))).toBe(original)
  })
})

describe('decodeUri', () => {
  it('decodes a valid URI string', () => expect(decodeUri('hello%20world')).toBe('hello world'))
  it('returns null for invalid sequence', () => expect(decodeUri('%zz')).toBeNull())
  it('returns empty string for empty input', () => expect(decodeUri('')).toBe(''))
})

// ─── JSON ─────────────────────────────────────────────────────────────────────

describe('encodeJson', () => {
  it('encodes an object', () => expect(encodeJson({ name: 'Zura' })).toBe('{"name":"Zura"}'))
  it('encodes an array', () => expect(encodeJson([1, 2, 3])).toBe('[1,2,3]'))
  it('encodes a primitive', () => expect(encodeJson(42)).toBe('42'))
  it('encodes null', () => expect(encodeJson(null)).toBe('null'))
  it('returns null for circular reference', () => {
    const obj: Record<string, unknown> = {}
    obj.self = obj
    expect(encodeJson(obj)).toBeNull()
  })
})

describe('decodeJson', () => {
  it('decodes a valid JSON string', () => expect(decodeJson('{"name":"Zura"}')).toEqual({ name: 'Zura' }))
  it('decodes an array', () => expect(decodeJson('[1,2,3]')).toEqual([1, 2, 3]))
  it('decodes a primitive', () => expect(decodeJson('42')).toBe(42))
  it('returns null for invalid JSON', () => expect(decodeJson('invalid json')).toBeNull())
  it('returns null for empty string', () => expect(decodeJson('')).toBeNull())
  it('round-trips with encodeJson', () => {
    const original = { a: 1, b: [2, 3] }
    expect(decodeJson(encodeJson(original)!)).toEqual(original)
  })
})