/**
 * Internal helpers — not exported from the package.
 *
 * Keys in duckkit accumulators come from user data (JSON, form fields, mapper
 * callbacks), so two plain-object pitfalls have to be handled everywhere:
 *
 * - `obj[key]` reads inherited members: for keys like `"toString"` or
 *   `"constructor"` it returns a function instead of `undefined`.
 * - `obj["__proto__"] = value` does not create a property: it calls the
 *   inherited setter and replaces the object's prototype.
 */

/** True when `key` is an own property of `obj` (inherited members don't count). */
export function hasOwnKey(obj: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/** Assigns `value` to `obj[key]` as an own, enumerable property — `"__proto__"` included. */
export function setOwn(obj: object, key: PropertyKey, value: unknown): void {
  if (key === '__proto__') {
    Object.defineProperty(obj, key, { value, writable: true, enumerable: true, configurable: true })
  } else {
    ;(obj as Record<PropertyKey, unknown>)[key] = value
  }
}
