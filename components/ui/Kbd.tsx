import type {
  HTMLAttributes,
} from "react";

import {
  cn,
} from "@/lib/utils";

export function Kbd({
 className,

  ...props
}: HTMLAttributes<HTMLElement>): React.JSX.Element {
  return (
    <kbd
     className={cn(
       "inline-flex min-h-6 min-w-6 items-center justify-center rounded-sm",
       "border border-border bg-[var(--color-gray-100)] px-1.5",
       "font-mono text-[11px] font-medium text-foreground",
       "shadow-[inset_0_-1px_0_rgb(17_17_17_/_0.12)]",
       "dark:bg-[var(--color-charcoal-800)]",
       className
     )}
     {...props}
    />
  );
}
