import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface ContentGridProps extends HTMLAttributes<HTMLDivElement> {
  readonly columns?: 1 | 2 | 3 | 4;

}

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
} as const;

export function ContentGrid({
  children,
  className,
  columns = 3,
  ...props
}: ContentGridProps): React.JSX.Element {
  return (
    <div
     className={cn(
       "grid gap-5 md:gap-6",
       columnClasses[columns],
       className
     )}
     {...props}
    >
     {children}
    </div>
  );
}
