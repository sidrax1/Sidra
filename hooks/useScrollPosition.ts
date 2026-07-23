"use client";

import { useEffect, useState } from "react";

export interface ScrollPosition {
  x: number;
  y: number;
  direction: "up" | "down" | null;
}

export function useScrollPosition(): ScrollPosition {
 const [position, setPosition] = useState<ScrollPosition>({
   x: 0,
   y: 0,
   direction: null,
 });

 useEffect(() => {
  let previousY = window.scrollY;
  let frame = 0;

  const update = (): void => {
   window.cancelAnimationFrame(frame);

    frame = window.requestAnimationFrame(() => {
      const currentY = window.scrollY;

     setPosition({
       x: window.scrollX,
       y: currentY,
       direction:
         currentY === previousY
          ? null
          : currentY > previousY
            ? "down"
            : "up",
     });

      previousY = currentY;
    });
  };

  update();
  window.addEventListener("scroll", update, { passive: true });

   return () => {
     window.removeEventListener("scroll", update);
     window.cancelAnimationFrame(frame);
   };
 }, []);

 return position;
}
