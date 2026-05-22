export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

/**
 * Recursively freezes an object and all nested objects.
 * Returns the object typed as deeply readonly.
 *
 * @example
 * const config = deepFreeze({ db: { host: 'localhost', port: 5432 } })
 * config.db.port = 9999  // TypeScript error ❌ — deeply readonly
 */
export function deepFreeze<T extends object>(obj: T): DeepReadonly<T> {
  Object.getOwnPropertyNames(obj).forEach(name => {
    const value = (obj as Record<string, unknown>)[name]
    if (value && typeof value === 'object') {
      deepFreeze(value as object)
    }
  })
  return Object.freeze(obj) as DeepReadonly<T>
}