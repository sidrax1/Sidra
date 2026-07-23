"use client";

import type {
  ReactNode,
} from "react";

import {
  RotateCcw,
  ShieldAlert,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/Button";

import {
  cn,
} from "@/lib/utils";

interface ErrorStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly retryLabel?: string;
  readonly onRetry?: () => void;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function ErrorState({
  action,
  className,
  description = "The experience could not be prepared at this moment. Please try again.",
  onRetry,
  retryLabel = "Try Again",
  title = "Something went wrong",
}: ErrorStateProps): React.JSX.Element {
  return (
    <section
      role="alert"
      className={cn(
        "relative overflow-hidden rounded-lg border",
        "border-[color:rgb(140_59_52_/_0.2)]",
        "bg-[var(--color-ivory-50)] px-6 py-14 text-center",
        "shadow-[var(--shadow-card)]",
        "dark:bg-[var(--color-charcoal-800)]",
        className
      )}
    >
      <div className="mx-auto flex max-w-xl flex-col items-center">
        <div
          aria-hidden="true"
          className="mb-6 flex size-14 items-center justify-center rounded-full border
border-[color:rgb(140_59_52_/_0.25)] bg-[color:rgb(140_59_52_/_0.08)] text-[var(--color-error)]"
        >
          <ShieldAlert className="size-6" />
        </div>

     <h2 className="font-heading text-3xl font-medium tracking-[-0.02em] text-foreground">
      {title}
     </h2>

     <p className="mt-3 max-w-md text-base leading-relaxed text-muted">

       {description}
      </p>

      {onRetry || action ? (
       <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
         <Button
           variant="outline"
           onClick={onRetry}
         >
           <RotateCcw
            aria-hidden="true"
            className="size-4"
           />

            {retryLabel}
          </Button>
        ) : null}

         {action}
       </div>
     ) : null}
    </div>
   </section>
 );
}
