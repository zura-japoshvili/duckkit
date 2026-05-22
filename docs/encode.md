# Encode

```typescript
import { encodeBase64, decodeBase64, encodeHex, decodeHex, encodeUri, decodeUri, encodeJson, decodeJson } from 'duckkit/encode'
```

Encoding and decoding utilities. All decode functions return `null` on invalid input instead of throwing.

---

## encodeBase64 / decodeBase64

Encodes and decodes strings using Base64.

```typescript
encodeBase64(value: string): string
decodeBase64(value: string): string | null
```

```typescript
encodeBase64('hello world')       // "aGVsbG8gd29ybGQ="
decodeBase64('aGVsbG8gd29ybGQ=') // "hello world"
decodeBase64('!!!invalid')        // null — invalid input, no throw ✅
```

Handles Unicode strings correctly.

> **`decodeBase64` returns `null` on failure:** Always check the return value before using it.

---

## encodeBase64Url / decodeBase64Url

URL-safe Base64 encoding. Replaces `+` with `-`, `/` with `_`, removes padding `=`.
Safe to use in URLs and HTTP headers without additional escaping.

```typescript
encodeBase64Url(value: string): string
decodeBase64Url(value: string): string | null
```

```typescript
encodeBase64Url('hello world')  // "aGVsbG8gd29ybGQ" — no +, /, = ✅
decodeBase64Url('aGVsbG8gd29ybGQ')  // "hello world"
```

> **Use this over `encodeBase64` for tokens, JWTs, and URL params.**

---

## encodeHex / decodeHex

Encodes and decodes strings using hexadecimal.

```typescript
encodeHex(value: string): string
decodeHex(value: string): string | null
```

```typescript
encodeHex('hello')       // "68656c6c6f"
decodeHex('68656c6c6f') // "hello"
decodeHex('zzzz')        // null — invalid hex ✅
decodeHex('abc')         // null — odd length ✅
```

Output is always lowercase. Decoding is case-insensitive.

> **`decodeHex` returns `null` for odd-length input or non-hex characters.**

---

## encodeUri / decodeUri

Wraps `encodeURIComponent` and `decodeURIComponent` with safe error handling.

```typescript
encodeUri(value: string): string
decodeUri(value: string): string | null
```

```typescript
encodeUri('hello world & more')  // "hello%20world%20%26%20more"
decodeUri('hello%20world')       // "hello world"
decodeUri('%zz')                 // null — invalid sequence ✅
```

> **`decodeUri` returns `null` instead of throwing on malformed sequences.**

---

## encodeJson / decodeJson

Safely stringifies and parses JSON. Both return `null` on failure instead of throwing.

```typescript
encodeJson(value: unknown): string | null
decodeJson<T = unknown>(value: string): T | null
```

```typescript
encodeJson({ name: 'Zura' })   // '{"name":"Zura"}'
encodeJson(circularObj)         // null — circular reference ✅

decodeJson('{"name":"Zura"}')  // { name: 'Zura' }
decodeJson('invalid json')     // null ✅

// with type parameter
const user = decodeJson<{ name: string }>('{"name":"Zura"}')
user?.name  // string ✅
```

> **`decodeJson` does not validate shape** 