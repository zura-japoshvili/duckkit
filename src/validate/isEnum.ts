/**
 * Returns `true` if the value is a valid member of the given enum.
 * Checks enum **values**, not keys.
 *
 * @param value - The value to check
 * @param enumObj - The enum object to check against
 * @returns `true` if value is a valid enum value, `false` otherwise
 *
 * @example
 * enum Direction { Up = 'UP', Down = 'DOWN' }
 * isEnum('UP', Direction)    // true
 * isEnum('LEFT', Direction)  // false
 * isEnum('Up', Direction)    // false — 'Up' is a key, not a value
 *
 * enum Status { Active = 1, Inactive = 2 }
 * isEnum(1, Status)   // true
 * isEnum(99, Status)  // false
 */
export function isEnum<T extends Record<string, string | number>>(
  value: unknown,
  enumObj: T
): value is T[keyof T] {
  return Object.values(enumObj).includes(value as T[keyof T])
}