"use client";

import type { RefObject } from "react";
import { useEffect } from "react";

export function useClickOutside<T extends HTMLElement>(
  reference: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true
): void {
  useEffect(() => {
   if (!enabled) {
     return;
   }

      const listener = (event: MouseEvent | TouchEvent): void => {
       const element = reference.current;
       const target = event.target;

       if (
         !element ||
         !(target instanceof Node) ||
         element.contains(target)
       ){
         return;
       }

        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener, {
        passive: true,
      });

   return () => {
     document.removeEventListener("mousedown", listener);
     document.removeEventListener("touchstart", listener);
   };
 }, [enabled, handler, reference]);
}
