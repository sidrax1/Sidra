export function removeUndefined<T extends Record<string, unknown>>(
  value: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as Partial<T>;
}

export function pick<
  T extends Record<string, unknown>,
  K extends keyof T,
>(
  value: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;

    for (const key of keys) {
      if (key in value) {
        result[key] = value[key];
      }
    }

    return result;
}

export function omit<
  T extends Record<string, unknown>,
  K extends keyof T,
>(
  value: T,
  keys: readonly K[]
): Omit<T, K> {
  const excluded = new Set<keyof T>(keys);

    return Object.fromEntries(
      Object.entries(value).filter(
        ([key]) => !excluded.has(key as keyof T)
      )
    ) as Omit<T, K>;
}

export function isPlainObject(

  value: unknown
): value is Record<string, unknown> {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ){
    return false;
  }

    const prototype = Object.getPrototypeOf(value);

    return prototype === Object.prototype || prototype === null;
}

export function deepFreeze<T>(value: T): Readonly<T> {
 if (
   typeof value !== "object" ||
   value === null ||
   Object.isFrozen(value)
 ){
   return value;
 }

    Object.freeze(value);

    for (const property of Object.values(value)) {
      deepFreeze(property);
    }

    return value;
}
