import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  readonly ratio?: number;
}

export function AspectRatio({
 children,
 className,
 ratio = 1,

  style,
  ...props
}: AspectRatioProps): React.JSX.Element {
  const safeRatio = ratio > 0 ? ratio : 1;

 return (
   <div
    className={cn("relative w-full overflow-hidden", className)}
    style={{
      aspectRatio: safeRatio,
      ...style,
    }}
    {...props}
   >
    <div className="absolute inset-0">{children}</div>
   </div>
 );
}
