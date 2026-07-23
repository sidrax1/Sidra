"use client";

import { useCallback, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export function useAsync<T, TArguments extends readonly unknown[]>(
  operation: (...arguments_: TArguments) => Promise<T>
): AsyncState<T> & {
  execute: (...arguments_: TArguments) => Promise<T>;
  reset: () => void;
}{
  const [state, setState] = useState<AsyncState<T>>({
   data: null,

  error: null,
  loading: false,
});

const execute = useCallback(
 async (...arguments_: TArguments): Promise<T> => {
  setState({
    data: null,
    error: null,
    loading: true,
  });

  try {
    const data = await operation(...arguments_);

    setState({
      data,
      error: null,
      loading: false,
    });

    return data;
  } catch (error) {
    const normalizedError =
     error instanceof Error
       ? error
       : new Error("Unexpected asynchronous error.");

    setState({
      data: null,
      error: normalizedError,
      loading: false,
    });

      throw normalizedError;
    }
  },
  [operation]
);

const reset = useCallback((): void => {
 setState({
  data: null,
  error: null,

     loading: false,
   });
 }, []);

 return {
   ...state,
   execute,
   reset,
 };
}
