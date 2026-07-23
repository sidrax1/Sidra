"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ChevronRight } from "lucide-react";

import { Slot } from "@radix-ui/react-slot";

import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { cn } from "@/lib/utils";

interface DropdownMenuContextValue {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
}

const DropdownMenuContext =
 createContext<DropdownMenuContextValue | null>(null);

interface DropdownMenuProps {
  readonly children: ReactNode;
}

export function DropdownMenu({
  children,
}: DropdownMenuProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const reference = useRef<HTMLDivElement>(null);

 useClickOutside(
   reference,
   () => setOpen(false),
   open
 );

 useEscapeKey(
  () => setOpen(false),
  open

    );

    return (
      <DropdownMenuContext.Provider
       value={{
         open,
         setOpen,
       }}
      >
       <div
         ref={reference}
         className="relative inline-flex"
       >
         {children}
       </div>
      </DropdownMenuContext.Provider>
    );
}

interface DropdownMenuTriggerProps {
  readonly children: ReactNode;
  readonly asChild?: boolean;
}

export function DropdownMenuTrigger({
  children,
  asChild = false,
}: DropdownMenuTriggerProps): React.JSX.Element {
  const context = useContext(DropdownMenuContext);

    if (!context) {
      throw new Error(
        "DropdownMenuTrigger must be used inside DropdownMenu."
      );
    }

    const Component = asChild ? Slot : "span";

    return (
      <Component
       onClick={() =>
         context.setOpen(!context.open)
       }
       aria-expanded={context.open}
      >
       {children}
      </Component>
    );

}

interface DropdownMenuContentProps {
  readonly children: ReactNode;
  readonly align?: "start" | "center" | "end";
  readonly className?: string;
}

const alignClasses = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
} as const;

export function DropdownMenuContent({
  align = "end",
  children,
  className,
}: DropdownMenuContentProps): React.JSX.Element | null {
  const context = useContext(DropdownMenuContext);

    if (!context) {
      throw new Error(
        "DropdownMenuContent must be used inside DropdownMenu."
      );
    }

    if (!context.open) {
      return null;
    }

    return (
     <div
       role="menu"
       className={cn(
         "absolute top-[calc(100%+10px)] z-50 min-w-56 overflow-hidden rounded-lg",
         "border border-[color:rgb(200_169_106_/_0.24)]",
         "bg-card p-1.5 text-foreground shadow-[var(--shadow-modal)]",
         "animate-in fade-in-0 zoom-in-95",
         alignClasses[align],
         className
       )}
     >
       {children}

      </div>
    );
}

interface DropdownMenuItemProps {
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly destructive?: boolean;
  readonly inset?: boolean;
  readonly onSelect?: () => void;
  readonly className?: string;
}

export function DropdownMenuItem({
  children,
  className,
  destructive = false,
  disabled = false,
  inset = false,
  onSelect,
}: DropdownMenuItemProps): React.JSX.Element {
  const context = useContext(DropdownMenuContext);

    if (!context) {
      throw new Error(
        "DropdownMenuItem must be used inside DropdownMenu."
      );
    }

    return (
     <button
       type="button"
       role="menuitem"
       disabled={disabled}
       onClick={() => {
         onSelect?.();
         context.setOpen(false);
       }}
       className={cn(
         "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm",
         "outline-none transition-colors",
         destructive
           ? "text-[var(--color-error)] hover:bg-[color:rgb(140_59_52_/_0.08)]"
           : "text-foreground hover:bg-[color:rgb(200_169_106_/_0.1)]",

         inset && "pl-9",
         disabled &&
           "pointer-events-none cursor-not-allowed opacity-45",
         className
       )}
      >
       {children}
      </button>
    );
}

export function DropdownMenuSeparator(): React.JSX.Element {
  return (
    <div className="my-1 h-px bg-border" />
  );
}

interface DropdownMenuLabelProps {
  readonly children: ReactNode;
}

export function DropdownMenuLabel({
  children,
}: DropdownMenuLabelProps): React.JSX.Element {
  return (
    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
     {children}
    </div>
  );
}

interface DropdownMenuSubIndicatorProps {
  readonly label: string;
}

export function DropdownMenuSubIndicator({
  label,
}: DropdownMenuSubIndicatorProps): React.JSX.Element {
  return (
    <span className="ml-auto inline-flex items-center gap-2 text-muted">
     <span className="text-xs">{label}</span>
     <ChevronRight
      aria-hidden={true}
      className="size-3.5"

    />
   </span>
 );
}
