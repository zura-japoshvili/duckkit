/**
 * Typed wrapper for `Object.hasOwn`. Returns `true` if the object
 * has the specified key as its own property — not inherited from the prototype.
 *
 * @example
 * hasOwn({ a: 1 }, 'a')      // true
 * hasOwn({ a: 1 }, 'b')      // false
 * hasOwn({}, 'toString')     // false — inherited, not own
 */
export function hasOwn<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key)
}