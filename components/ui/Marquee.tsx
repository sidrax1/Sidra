import type {

  ReactNode,
} from "react";

import {
  cn,
} from "@/lib/utils";

interface MarqueeProps {
  readonly children: ReactNode;
  readonly durationSeconds?: number;
  readonly reverse?: boolean;
  readonly pauseOnHover?: boolean;
  readonly className?: string;
}

export function Marquee({
  children,
  className,
  durationSeconds = 30,
  pauseOnHover = true,
  reverse = false,
}: MarqueeProps): React.JSX.Element {
  return (
   <div
     className={cn(
       "group flex overflow-hidden",
       className
     )}
   >
     <div
       className={cn(
         "flex min-w-full shrink-0 animate-[sidra-marquee_linear_infinite] items-centerjustify-around gap-10 pr-10",
         reverse &&
           "[animation-direction:reverse]",
         pauseOnHover &&
           "group-hover:[animation-play-state:paused]"
       )}
       style={{
         animationDuration: `${durationSeconds}s`,
       }}
     >
       {children}
     </div>

     <div
      aria-hidden={true}
      className={cn(
        "flex min-w-full shrink-0 animate-[sidra-marquee_linear_infinite] items-centerjustify-around gap-10 pr-10",
        reverse &&
          "[animation-direction:reverse]",
        pauseOnHover &&
          "group-hover:[animation-play-state:paused]"
      )}
      style={{
        animationDuration: `${durationSeconds}s`,
      }}
     >
      {children}
     </div>
    </div>
  );
}
