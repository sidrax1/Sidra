"use client";

import { useEffect } from "react";

export function useEscapeKey(
  handler: () => void,
  enabled = true
): void {
  useEffect(() => {
   if (!enabled) {
     return;
   }

      const listener = (event: KeyboardEvent): void => {
        if (event.key === "Escape") {
          handler();
        }
      };

      window.addEventListener("keydown", listener);

   return () => {
     window.removeEventListener("keydown", listener);
   };
 }, [enabled, handler]);
}
