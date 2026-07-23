"use client";

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import {
  X,
} from "lucide-react";

import {
  IconButton,
} from "@/components/ui/IconButton";

import {
  cn,
} from "@/lib/utils";

export const Dialog =
 DialogPrimitive.Root;

export const DialogTrigger =
 DialogPrimitive.Trigger;

export const DialogClose =
 DialogPrimitive.Close;

export const DialogPortal =
 DialogPrimitive.Portal;

export const DialogOverlay = forwardRef<
  ElementRef<
    typeof DialogPrimitive.Overlay
  >,
  ComponentPropsWithoutRef<
    typeof DialogPrimitive.Overlay
  >
>(function DialogOverlay(
  {
    className,
    ...props
  },
  forwardedRef
){
  return (
    <DialogPrimitive.Overlay
      ref={forwardedRef}
      className={cn(
        "fixed inset-0 z-50",
        "bg-[color:rgb(11_11_11_/_0.68)]",
        "backdrop-blur-md",
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=open]:fade-in-0",
        "motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  );
});

DialogOverlay.displayName =
 DialogPrimitive.Overlay.displayName;

export interface DialogContentProps
  extends ComponentPropsWithoutRef<
   typeof DialogPrimitive.Content
  >{
  readonly showCloseButton?: boolean;
  readonly closeLabel?: string;
}

export const DialogContent = forwardRef<
 ElementRef<
   typeof DialogPrimitive.Content
 >,
 DialogContentProps
>(function DialogContent(
 {
   children,
   className,
   closeLabel = "Close dialog",
   showCloseButton = true,
   ...props
 },
 forwardedRef
){
 return (
   <DialogPortal>
     <DialogOverlay />

   <DialogPrimitive.Content
    ref={forwardedRef}
    className={cn(
     "fixed left-1/2 top-1/2 z-50",
     "grid w-[calc(100%-2rem)] max-w-xl",
     "-translate-x-1/2 -translate-y-1/2",
     "gap-6 overflow-hidden",
     "rounded-[var(--radius-lg)]",
     "border border-[color:rgb(200_169_106_/_0.28)]",
     "bg-[var(--color-ivory-50)]",
     "p-6 text-[var(--color-black-900)]",
     "shadow-[var(--shadow-modal)]",
     "dark:bg-[var(--color-charcoal-800)]",

       "dark:text-[var(--color-ivory-100)]",
       "data-[state=open]:animate-in",
       "data-[state=closed]:animate-out",
       "data-[state=closed]:fade-out-0",
       "data-[state=open]:fade-in-0",
       "data-[state=closed]:zoom-out-95",
       "data-[state=open]:zoom-in-95",
       "data-[state=closed]:slide-out-to-left-1/2",
       "data-[state=closed]:slide-out-to-top-[48%]",
       "data-[state=open]:slide-in-from-left-1/2",
       "data-[state=open]:slide-in-from-top-[48%]",
       "duration-[var(--duration-slow)]",
       "motion-reduce:transform-none",
       "motion-reduce:transition-none",
       className
     )}
     {...props}
   >
     <div
       aria-hidden={true}
       className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-2/3
bg-gradient-to-r from-transparent via-[var(--color-gold-500)] to-transparent opacity-70"
     />

     {children}

     {showCloseButton ? (
       <DialogPrimitive.Close
         asChild
       >
         <IconButton
          label={closeLabel}
          icon={
            <X aria-hidden={true} />
          }
          appearance="ghost"
          size="sm"
          className="absolute right-4 top-4"
         />
       </DialogPrimitive.Close>
     ) : null}
    </DialogPrimitive.Content>
   </DialogPortal>
 );

});

DialogContent.displayName =
 DialogPrimitive.Content.displayName;

export function DialogHeader({
  children,
  className,
}: {
  readonly children: ReactNode;
  readonly className?: string;
}): React.JSX.Element {
  return (
    <div
     className={cn(
       "grid gap-2 pr-12 text-left",
       className
     )}
    >
     {children}
    </div>
  );
}

export function DialogFooter({
  children,
  className,
}: {
  readonly children: ReactNode;
  readonly className?: string;
}): React.JSX.Element {
  return (
    <div
     className={cn(
       "flex flex-col-reverse gap-3 border-t border-border pt-5",
       "sm:flex-row sm:justify-end",
       className
     )}
    >
     {children}
    </div>
  );
}

export const DialogTitle = forwardRef<
  ElementRef<
    typeof DialogPrimitive.Title
  >,
  ComponentPropsWithoutRef<
    typeof DialogPrimitive.Title
  >
>(function DialogTitle(
  {
    className,
    ...props
  },
  forwardedRef
){
  return (
    <DialogPrimitive.Title
      ref={forwardedRef}
      className={cn(
        "font-heading text-3xl font-medium",
        "leading-tight tracking-[-0.02em]",
        "text-foreground",
        className
      )}
      {...props}
    />
  );
});

DialogTitle.displayName =
 DialogPrimitive.Title.displayName;

export const DialogDescription = forwardRef<
 ElementRef<
   typeof DialogPrimitive.Description
 >,
 ComponentPropsWithoutRef<
   typeof DialogPrimitive.Description
 >
>(function DialogDescription(
 {
   className,
   ...props
 },
 forwardedRef

){
  return (
    <DialogPrimitive.Description
     ref={forwardedRef}
     className={cn(
       "text-sm leading-relaxed text-muted",
       className
     )}
     {...props}
    />
  );
});

DialogDescription.displayName =
  DialogPrimitive.Description.displayName;
