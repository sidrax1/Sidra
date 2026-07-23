"use client";

import { useCallback, useState } from "react";

export interface ClipboardState {
  copied: boolean;
  error: Error | null;
  copy: (value: string) => Promise<boolean>;
}

export function useClipboard(
  resetAfterMilliseconds = 1800
): ClipboardState {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

 const copy = useCallback(
  async (value: string): Promise<boolean> => {
   try {
     await navigator.clipboard.writeText(value);

      setCopied(true);
      setError(null);

      window.setTimeout(() => {
        setCopied(false);
      }, resetAfterMilliseconds);

      return true;

      } catch (copyError) {
        setError(
          copyError instanceof Error
           ? copyError
           : new Error("Unable to copy content.")
        );

       return false;
     }
   },
   [resetAfterMilliseconds]
 );

 return {
   copied,
   error,
   copy,
 };
}
