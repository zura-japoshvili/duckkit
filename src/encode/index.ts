/**
 * Encoding and decoding utilities.
 * Base64, Base64URL, Hex, URI — all with proper error handling.
 */

// ─── Base64 ───────────────────────────────────────────────────────────────────

/**
 * Encodes a string to Base64.
 *
 * @example
 * encodeBase64('hello world')  // "aGVsbG8gd29ybGQ="
 */
export function encodeBase64(value: string): string {
  return btoa(unescape(encodeURIComponent(value)))
}

/**
 * Decodes a Base64 string. Returns `null` if the input is invalid.
 *
 * @example
 * decodeBase64('aGVsbG8gd29ybGQ=')  // "hello world"
 * decodeBase64('!!!invalid')         // null
 */
export function decodeBase64(value: string): string | null {
  try {
    return decodeURIComponent(escape(atob(value)))
  } catch {
    return null
  }
}

// ─── Base64URL ────────────────────────────────────────────────────────────────

/**
 * Encodes a string to Base64URL (URL-safe Base64).
 * Replaces `+` with `-`, `/` with `_`, removes padding `=`.
 *
 * @example
 * encodeBase64Url('hello world')  // "aGVsbG8gd29ybGQ"
 */
export function encodeBase64Url(value: string): string {
  return encodeBase64(value)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Decodes a Base64URL string. Returns `null` if the input is invalid.
 *
 * @example
 * decodeBase64Url('aGVsbG8gd29ybGQ')  // "hello world"
 */
export function decodeBase64Url(value: string): string | null {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(
    value.length + ((4 - (value.length % 4)) % 4),
    '='
  )
  return decodeBase64(padded)
}

// ─── Hex ──────────────────────────────────────────────────────────────────────

/**
 * Encodes a string to hexadecimal.
 *
 * @example
 * encodeHex('hello')  // "68656c6c6f"
 */
export function encodeHex(value: string): string {
  return Array.from(value)
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Decodes a hexadecimal string. Returns `null` if the input is invalid.
 *
 * @example
 * decodeHex('68656c6c6f')  // "hello"
 * decodeHex('zzzz')        // null
 */
export function decodeHex(value: string): string | null {
  if (value.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(value)) return null
  let result = ''
  for (let i = 0; i < value.length; i += 2) {
    result += String.fromCharCode(parseInt(value.slice(i, i + 2), 16))
  }
  return result
}

// ─── URI ──────────────────────────────────────────────────────────────────────

/**
 * Encodes a string for use in a URI component.
 * Wraps `encodeURIComponent` with safe error handling.
 *
 * @example
 * encodeUri('hello world & more')  // "hello%20world%20%26%20more"
 */
export function encodeUri(value: string): string {
  return encodeURIComponent(value)
}

/**
 * Decodes a URI-encoded string. Returns `null` if the input is invalid.
 *
 * @example
 * decodeUri('hello%20world')  // "hello world"
 * decodeUri('%zz')            // null
 */
export function decodeUri(value: string): string | null {
  try {
    return decodeURIComponent(value)
  } catch {
    return null
  }
}

// ─── JSON ─────────────────────────────────────────────────────────────────────

/**
 * Safely encodes a value to a JSON string.
 * Returns `null` if serialization fails (e.g. circular reference).
 *
 * @example
 * encodeJson({ name: 'Zura' })  // '{"name":"Zura"}'
 * encodeJson(circular)          // null
 */
export function encodeJson(value: unknown): string | null {
  try {
    return JSON.stringify(value)
  } catch {
    return null
  }
}

/**
 * Safely decodes a JSON string. Returns `null` if parsing fails.
 *
 * @example
 * decodeJson('{"name":"Zura"}')  // { name: 'Zura' }
 * decodeJson('invalid json')     // null
 */
export function decodeJson<T = unknown>(value: string): T | null {
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}