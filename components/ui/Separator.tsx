import type {
  HTMLAttributes,
} from "react";

import {
  cn,
} from "@/lib/utils";

export interface SeparatorProps
  extends HTMLAttributes<HTMLDivElement> {
  readonly orientation?: "horizontal" | "vertical";
  readonly decorative?: boolean;
}

export function Separator({

  className,
  decorative = true,
  orientation = "horizontal",
  ...props
}: SeparatorProps): React.JSX.Element {
  return (
    <div
     role={
       decorative
         ? "presentation"
         : "separator"
     }
     aria-orientation={
       decorative
         ? undefined
         : orientation
     }
     className={cn(
       "shrink-0 bg-[var(--color-border)]",
       orientation === "horizontal"
         ? "h-px w-full"
         : "h-full w-px",
       className
     )}
     {...props}
    />
  );
}
