"use client";

import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): readonly [T, (value: T | ((current: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(initialValue);

 useEffect(() => {
  try {
    const stored = window.localStorage.getItem(key);

     if (stored !== null) {
       setValue(JSON.parse(stored) as T);
     }
   } catch {
     setValue(initialValue);
   }
 }, [initialValue, key]);

 const update = useCallback(
  (nextValue: T | ((current: T) => T)): void => {
   setValue((current) => {
    const resolved =
     typeof nextValue === "function"
       ? (nextValue as (current: T) => T)(current)
       : nextValue;

      window.localStorage.setItem(key, JSON.stringify(resolved));

       return resolved;
     });
   },
   [key]
 );

 const remove = useCallback((): void => {
   window.localStorage.removeItem(key);
   setValue(initialValue);
 }, [initialValue, key]);

  return [value, update, remove] as const;
}
