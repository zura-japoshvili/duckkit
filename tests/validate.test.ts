import { describe, it, expect } from 'vitest'
import {
  isEmail, isUrl, isUUID, isIP, isIPv4, isIPv6,
  isCreditCard, isPhone,
  isString, isNumber, isBoolean, isArray, isObject,
  isDate, isFunction, isNull, isUndefined, isNullOrUndefined, isPromise,
  isEmpty, isEmptyObject, isEnum, isNaN, isFinite,
} from '../src/validate/index'

// ─── isEmail ──────────────────────────────────────────────────────────────────

describe('isEmail', () => {
  it('valid email', () => expect(isEmail('z@z.com')).toBe(true))
  it('valid with subdomain', () => expect(isEmail('user@mail.co.uk')).toBe(true))
  it('valid with plus', () => expect(isEmail('user+tag@example.com')).toBe(true))
  it('missing @', () => expect(isEmail('notanemail')).toBe(false))
  it('missing domain', () => expect(isEmail('z@')).toBe(false))
  it('missing tld', () => expect(isEmail('z@z')).toBe(false))
  it('empty string', () => expect(isEmail('')).toBe(false))
  it('spaces not allowed', () => expect(isEmail('z z@z.com')).toBe(false))
})

// ─── isUrl ────────────────────────────────────────────────────────────────────

describe('isUrl', () => {
  it('valid http', () => expect(isUrl('http://example.com')).toBe(true))
  it('valid https', () => expect(isUrl('https://github.com')).toBe(true))
  it('with path', () => expect(isUrl('https://github.com/zura-japoshvili/duckkit')).toBe(true))
  it('with query', () => expect(isUrl('https://example.com?a=1&b=2')).toBe(true))
  it('ftp not valid', () => expect(isUrl('ftp://example.com')).toBe(false))
  it('plain string', () => expect(isUrl('not a url')).toBe(false))
  it('empty string', () => expect(isUrl('')).toBe(false))
  it('missing protocol', () => expect(isUrl('github.com')).toBe(false))
})

// ─── isUUID ───────────────────────────────────────────────────────────────────

describe('isUUID', () => {
  it('valid UUID v4 lowercase', () => expect(isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true))
  it('valid UUID v4 uppercase', () => expect(isUUID('550E8400-E29B-41D4-A716-446655440000')).toBe(true))
  it('wrong version digit', () => expect(isUUID('550e8400-e29b-31d4-a716-446655440000')).toBe(false))
  it('too short', () => expect(isUUID('550e8400-e29b')).toBe(false))
  it('no dashes', () => expect(isUUID('550e8400e29b41d4a716446655440000')).toBe(false))
  it('empty string', () => expect(isUUID('')).toBe(false))
})

// ─── isIPv4 / isIPv6 / isIP ───────────────────────────────────────────────────

describe('isIPv4', () => {
  it('valid', () => expect(isIPv4('192.168.1.1')).toBe(true))
  it('0.0.0.0', () => expect(isIPv4('0.0.0.0')).toBe(true))
  it('255.255.255.255', () => expect(isIPv4('255.255.255.255')).toBe(true))
  it('256 out of range', () => expect(isIPv4('256.0.0.1')).toBe(false))
  it('missing octet', () => expect(isIPv4('192.168.1')).toBe(false))
  it('letters', () => expect(isIPv4('abc.def.ghi.jkl')).toBe(false))
})

describe('isIPv6', () => {
  it('loopback ::1', () => expect(isIPv6('::1')).toBe(true))
  it('full address', () => expect(isIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true))
  it('compressed', () => expect(isIPv6('2001:db8::1')).toBe(true))
  it('plain string', () => expect(isIPv6('not-an-ip')).toBe(false))
})

describe('isIP', () => {
  it('accepts IPv4', () => expect(isIP('192.168.1.1')).toBe(true))
  it('accepts IPv6', () => expect(isIP('::1')).toBe(true))
  it('rejects invalid', () => expect(isIP('not-an-ip')).toBe(false))
})

// ─── isCreditCard ─────────────────────────────────────────────────────────────

describe('isCreditCard', () => {
  it('valid Visa test number', () => expect(isCreditCard('4242424242424242')).toBe(true))
  it('valid with spaces', () => expect(isCreditCard('4242 4242 4242 4242')).toBe(true))
  it('valid Mastercard test', () => expect(isCreditCard('5555555555554444')).toBe(true))
  it('invalid Luhn', () => expect(isCreditCard('1234567890123456')).toBe(false))
  it('too short', () => expect(isCreditCard('123456')).toBe(false))
  it('empty string', () => expect(isCreditCard('')).toBe(false))
})

// ─── isPhone ──────────────────────────────────────────────────────────────────

describe('isPhone', () => {
  it('valid with country code', () => expect(isPhone('+1 (555) 123-4567')).toBe(true))
  it('valid plain digits', () => expect(isPhone('5551234567')).toBe(true))
  it('valid with dashes', () => expect(isPhone('555-123-4567')).toBe(true))
  it('too short', () => expect(isPhone('123')).toBe(false))
  it('letters only', () => expect(isPhone('abc')).toBe(false))
  it('empty string', () => expect(isPhone('')).toBe(false))
})

// ─── Type Guards ──────────────────────────────────────────────────────────────

describe('isString', () => {
  it('string', () => expect(isString('hello')).toBe(true))
  it('empty string', () => expect(isString('')).toBe(true))
  it('number', () => expect(isString(42)).toBe(false))
  it('null', () => expect(isString(null)).toBe(false))
  it('undefined', () => expect(isString(undefined)).toBe(false))
})

describe('isNumber', () => {
  it('integer', () => expect(isNumber(42)).toBe(true))
  it('float', () => expect(isNumber(3.14)).toBe(true))
  it('0', () => expect(isNumber(0)).toBe(true))
  it('NaN returns false', () => expect(isNumber(NaN)).toBe(false))
  it('string', () => expect(isNumber('42')).toBe(false))
  it('null', () => expect(isNumber(null)).toBe(false))
})

describe('isBoolean', () => {
  it('true', () => expect(isBoolean(true)).toBe(true))
  it('false', () => expect(isBoolean(false)).toBe(true))
  it('string true', () => expect(isBoolean('true')).toBe(false))
  it('0', () => expect(isBoolean(0)).toBe(false))
  it('null', () => expect(isBoolean(null)).toBe(false))
})

describe('isArray', () => {
  it('array', () => expect(isArray([1, 2, 3])).toBe(true))
  it('empty array', () => expect(isArray([])).toBe(true))
  it('object', () => expect(isArray({})).toBe(false))
  it('string', () => expect(isArray('abc')).toBe(false))
  it('null', () => expect(isArray(null)).toBe(false))
})

describe('isObject', () => {
  it('plain object', () => expect(isObject({ a: 1 })).toBe(true))
  it('empty object', () => expect(isObject({})).toBe(true))
  it('array returns false', () => expect(isObject([])).toBe(false))
  it('null returns false', () => expect(isObject(null)).toBe(false))
  it('Date instance returns false', () => expect(isObject(new Date())).toBe(false))
  it('string returns false', () => expect(isObject('hello')).toBe(false))
  it('number returns false', () => expect(isObject(42)).toBe(false))
})

describe('isDate', () => {
  it('valid Date', () => expect(isDate(new Date())).toBe(true))
  it('invalid Date returns false', () => expect(isDate(new Date('invalid'))).toBe(false))
  it('string returns false', () => expect(isDate('2026-01-01')).toBe(false))
  it('number returns false', () => expect(isDate(Date.now())).toBe(false))
  it('null returns false', () => expect(isDate(null)).toBe(false))
})

describe('isFunction', () => {
  it('arrow function', () => expect(isFunction(() => {})).toBe(true))
  it('named function', () => expect(isFunction(function fn() {})).toBe(true))
  it('object', () => expect(isFunction({})).toBe(false))
  it('null', () => expect(isFunction(null)).toBe(false))
  it('string', () => expect(isFunction('fn')).toBe(false))
})

describe('isNull', () => {
  it('null', () => expect(isNull(null)).toBe(true))
  it('undefined', () => expect(isNull(undefined)).toBe(false))
  it('0', () => expect(isNull(0)).toBe(false))
  it('empty string', () => expect(isNull('')).toBe(false))
})

describe('isUndefined', () => {
  it('undefined', () => expect(isUndefined(undefined)).toBe(true))
  it('null', () => expect(isUndefined(null)).toBe(false))
  it('0', () => expect(isUndefined(0)).toBe(false))
})

describe('isNullOrUndefined', () => {
  it('null', () => expect(isNullOrUndefined(null)).toBe(true))
  it('undefined', () => expect(isNullOrUndefined(undefined)).toBe(true))
  it('0 returns false', () => expect(isNullOrUndefined(0)).toBe(false))
  it('empty string returns false', () => expect(isNullOrUndefined('')).toBe(false))
  it('false returns false', () => expect(isNullOrUndefined(false)).toBe(false))
})

describe('isPromise', () => {
  it('Promise.resolve', () => expect(isPromise(Promise.resolve())).toBe(true))
  it('new Promise', () => expect(isPromise(new Promise(() => {}))).toBe(true))
  it('thenable object returns false', () => expect(isPromise({ then: () => {} })).toBe(false))
  it('null returns false', () => expect(isPromise(null)).toBe(false))
  it('string returns false', () => expect(isPromise('promise')).toBe(false))
})

// ─── Value Checks ─────────────────────────────────────────────────────────────

describe('isEmpty', () => {
  it('empty string', () => expect(isEmpty('')).toBe(true))
  it('whitespace string', () => expect(isEmpty('   ')).toBe(true))
  it('non-empty string', () => expect(isEmpty('hello')).toBe(false))
  it('empty array', () => expect(isEmpty([])).toBe(true))
  it('non-empty array', () => expect(isEmpty([1])).toBe(false))
  it('empty object', () => expect(isEmpty({})).toBe(true))
  it('non-empty object', () => expect(isEmpty({ a: 1 })).toBe(false))
})

describe('isEmptyObject', () => {
  it('empty object', () => expect(isEmptyObject({})).toBe(true))
  it('non-empty object', () => expect(isEmptyObject({ a: 1 })).toBe(false))
  it('key with undefined value', () => expect(isEmptyObject({ a: undefined })).toBe(false))
  it('key with null value', () => expect(isEmptyObject({ a: null } as any)).toBe(false))
})

// ─── isEnum ───────────────────────────────────────────────────────────────────

describe('isEnum', () => {
  enum Direction { Up = 'UP', Down = 'DOWN' }
  enum Status { Active = 1, Inactive = 2 }

  it('valid string enum value', () => expect(isEnum('UP', Direction)).toBe(true))
  it('invalid string enum value', () => expect(isEnum('LEFT', Direction)).toBe(false))
  it('enum key is not valid', () => expect(isEnum('Up', Direction)).toBe(false))
  it('valid numeric enum value', () => expect(isEnum(1, Status)).toBe(true))
  it('invalid numeric enum value', () => expect(isEnum(99, Status)).toBe(false))
  it('null is not valid', () => expect(isEnum(null, Direction)).toBe(false))
  it('undefined is not valid', () => expect(isEnum(undefined, Direction)).toBe(false))
})

// ─── isNaN ────────────────────────────────────────────────────────────────────

describe('isNaN', () => {
  it('NaN returns true', () => expect(isNaN(NaN)).toBe(true))
  it('number returns false', () => expect(isNaN(42)).toBe(false))
  it('undefined returns false', () => expect(isNaN(undefined)).toBe(false))
  it('string returns false', () => expect(isNaN('hello')).toBe(false))
  it('null returns false', () => expect(isNaN(null)).toBe(false))
  it('0 returns false', () => expect(isNaN(0)).toBe(false))
})

// ─── isFinite ─────────────────────────────────────────────────────────────────

describe('isFinite', () => {
  it('integer returns true', () => expect(isFinite(42)).toBe(true))
  it('float returns true', () => expect(isFinite(3.14)).toBe(true))
  it('0 returns true', () => expect(isFinite(0)).toBe(true))
  it('Infinity returns false', () => expect(isFinite(Infinity)).toBe(false))
  it('-Infinity returns false', () => expect(isFinite(-Infinity)).toBe(false))
  it('NaN returns false', () => expect(isFinite(NaN)).toBe(false))
  it('string returns false', () => expect(isFinite('42')).toBe(false))
  it('null returns false', () => expect(isFinite(null)).toBe(false))
})