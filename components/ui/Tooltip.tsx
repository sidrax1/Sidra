"use client";

import {

  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

interface TooltipContextValue {
  readonly open: boolean;
  readonly tooltipId: string;
  readonly setOpen: (open: boolean) => void;
}

const TooltipContext =
 createContext<TooltipContextValue | null>(null);

interface TooltipProps {
  readonly children: ReactNode;
  readonly defaultOpen?: boolean;
}

export function Tooltip({
  children,
  defaultOpen = false,
}: TooltipProps): React.JSX.Element {
  const tooltipId = useId();
  const [open, setOpen] = useState(defaultOpen);

 const value = useMemo<TooltipContextValue>(
   () => ({
     open,
     tooltipId,
     setOpen,
   }),
   [open, tooltipId]
 );

 return (
  <TooltipContext.Provider value={value}>
    <span
     className="relative inline-flex"

        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocusCapture={() => setOpen(true)}
        onBlurCapture={() => setOpen(false)}
       >
        {children}
       </span>
      </TooltipContext.Provider>
    );
}

interface TooltipTriggerProps {
  readonly children: ReactNode;
}

export function TooltipTrigger({
  children,
}: TooltipTriggerProps): React.JSX.Element {
  const context = useContext(TooltipContext);

    if (!context) {
      throw new Error(
        "TooltipTrigger must be used inside Tooltip."
      );
    }

    return (
      <span aria-describedby={context.tooltipId}>
       {children}
      </span>
    );
}

interface TooltipContentProps {
  readonly children: ReactNode;
  readonly side?: "top" | "right" | "bottom" | "left";
  readonly className?: string;
}

const sideClasses = {
 top: "bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2",
 right: "left-[calc(100%+10px)] top-1/2 -translate-y-1/2",
 bottom: "left-1/2 top-[calc(100%+10px)] -translate-x-1/2",
 left: "right-[calc(100%+10px)] top-1/2 -translate-y-1/2",

} as const;

export function TooltipContent({
  children,
  className,
  side = "top",
}: TooltipContentProps): React.JSX.Element | null {
  const context = useContext(TooltipContext);

 if (!context) {
   throw new Error(
     "TooltipContent must be used inside Tooltip."
   );
 }

 if (!context.open) {
   return null;
 }

 return (
   <span
    id={context.tooltipId}
    role="tooltip"
    className={cn(
      "pointer-events-none absolute z-50 w-max max-w-64 rounded-md",
      "border border-[color:rgb(200_169_106_/_0.28)]",
      "bg-[var(--color-black-900)] px-3 py-2",
      "text-xs leading-relaxed text-[var(--color-ivory-100)]",
      "shadow-[var(--shadow-modal)]",
      "animate-in fade-in-0 zoom-in-95",
      sideClasses[side],
      className
    )}
   >
    {children}
   </span>
 );
}
