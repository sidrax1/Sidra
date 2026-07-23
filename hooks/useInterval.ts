"use client";

import { useEffect, useRef } from "react";

export function useInterval(
  callback: () => void,
  delayMilliseconds: number | null
): void {
  const callbackReference = useRef(callback);

 useEffect(() => {
   callbackReference.current = callback;
 }, [callback]);

 useEffect(() => {
  if (delayMilliseconds === null) {
    return;
  }

      const interval = window.setInterval(() => {
        callbackReference.current();
      }, delayMilliseconds);

   return () => {
     window.clearInterval(interval);
   };
 }, [delayMilliseconds]);
}
