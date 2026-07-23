"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

import { X } from "lucide-react";

import { IconButton } from "@/components/ui/IconButton";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { cn } from "@/lib/utils";

interface DrawerContextValue {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

const DrawerContext =
 createContext<DrawerContextValue | null>(null);

interface DrawerProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly children: ReactNode;
}

export function Drawer({
 children,
 onOpenChange,

  open,
}: DrawerProps): React.JSX.Element {
  useBodyScrollLock(open);
  useEscapeKey(
    () => onOpenChange(false),
    open
  );

    useEffect(() => {
     if (!open) {
       return;
     }

     const previousFocus =
      document.activeElement instanceof HTMLElement
       ? document.activeElement
       : null;

      return () => {
        previousFocus?.focus();
      };
    }, [open]);

    return (
      <DrawerContext.Provider
       value={{
         open,
         onOpenChange,
       }}
      >
       {children}
      </DrawerContext.Provider>
    );
}

interface DrawerContentProps {
  readonly children: ReactNode;
  readonly side?: "left" | "right" | "bottom";
  readonly title: string;
  readonly description?: string;
  readonly className?: string;
}

const sideClasses = {

  left: "left-0 top-0 h-full w-[min(90vw,440px)] border-r",
  right: "right-0 top-0 h-full w-[min(90vw,440px)] border-l",
  bottom:
    "bottom-0 left-0 max-h-[90vh] w-full rounded-t-[var(--radius-xl)] border-t",
} as const;

const closedTransforms = {
  left: "-translate-x-full",
  right: "translate-x-full",
  bottom: "translate-y-full",
} as const;

export function DrawerContent({
  children,
  className,
  description,
  side = "right",
  title,
}: DrawerContentProps): React.JSX.Element | null {
  const context = useContext(DrawerContext);

 if (!context) {
   throw new Error(
     "DrawerContent must be used inside Drawer."
   );
 }

 return (
  <div
    aria-hidden={!context.open}
    className={cn(
      "fixed inset-0 z-50",
      context.open
        ? "pointer-events-auto"
        : "pointer-events-none"
    )}
  >
    <button
      type="button"
      aria-label="Close drawer"
      onClick={() =>
        context.onOpenChange(false)
      }
      className={cn(

       "absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacityduration-[var(--duration-slow)]",
       context.open
        ? "opacity-100"
        : "opacity-0"
     )}
   />

   <section
    role="dialog"
    aria-modal="true"
    aria-label={title}
    className={cn(
      "absolute flex flex-col overflow-hidden border-[color:rgb(200_169_106_/_0.24)]",
      "bg-card text-foreground shadow-[var(--shadow-modal)]",
      "transition-transform duration-[var(--duration-slow)] ease-[var(--ease-luxury)]",
      sideClasses[side],
      context.open
        ? "translate-x-0 translate-y-0"
        : closedTransforms[side],
      className
    )}
   >
    <header className="flex items-start justify-between gap-6 border-b border-border p-6">
      <div>
        <h2 className="font-heading text-3xl font-medium tracking-[-0.025em]">
          {title}
        </h2>

       {description ? (
         <p className="mt-2 text-sm leading-6 text-muted">
           {description}
         </p>
       ) : null}
      </div>

      <IconButton
       label="Close drawer"
       icon={<X aria-hidden={true} />}
       appearance="ghost"
       onClick={() =>
         context.onOpenChange(false)
       }
      />

      </header>

     <div className="min-h-0 flex-1 overflow-y-auto p-6">
       {children}
     </div>
    </section>
   </div>
 );
}
