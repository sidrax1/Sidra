import type {
  HTMLAttributes,
} from "react";

import {
  cn,
} from "@/lib/utils";

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement> {
  readonly rounded?: "sm" | "md" | "lg" | "full";
}

const roundedClasses = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
} as const;

export function Skeleton({

  className,
  rounded = "md",
  ...props
}: SkeletonProps): React.JSX.Element {
  return (
    <div
     aria-hidden={true}
     className={cn(
       "relative overflow-hidden bg-[var(--color-gray-100)]",
       "before:absolute before:inset-0",
       "before:-translate-x-full",
       "before:animate-[sidra-shimmer_1.8s_infinite]",
       "before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.72),transparent)]",
       "dark:bg-[var(--color-charcoal-800)]",
       "dark:before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]",
       roundedClasses[rounded],
       className
     )}
     {...props}
    />
  );
}
