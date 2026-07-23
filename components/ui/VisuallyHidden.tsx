import {
  Slot,
} from "@radix-ui/react-slot";

import type {
  HTMLAttributes,
} from "react";

import {
  cn,
} from "@/lib/utils";

export interface VisuallyHiddenProps
  extends HTMLAttributes<HTMLSpanElement> {
  readonly asChild?: boolean;
}

export function VisuallyHidden({
  asChild = false,
  className,
  ...props
}: VisuallyHiddenProps): React.JSX.Element {
  const Component =
    asChild ? Slot : "span";

 return (
   <Component
    className={cn(
      "absolute size-px overflow-hidden whitespace-nowrap border-0 p-0",
      "[-webkit-clip-path:inset(50%)]",
      "[clip-path:inset(50%)]",
      className
    )}
    {...props}
   />
 );
}
