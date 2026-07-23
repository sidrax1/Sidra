import type {
  ReactNode,
} from "react";

import {
  Gem,
} from "lucide-react";

import {

  cn,
} from "@/lib/utils";

interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
  readonly icon?: ReactNode;
  readonly className?: string;
}

export function EmptyState({
  action,
  className,
  description,
  icon,
  title,
}: EmptyStateProps): React.JSX.Element {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-lg border border-[color:rgb(200_169_106_/_0.22)]",
        "bg-[var(--color-ivory-50)] px-6 py-14 text-center",
        "shadow-[var(--shadow-card)]",
        "dark:bg-[var(--color-charcoal-800)]",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-2/3
bg-gradient-to-r from-transparent via-[var(--color-gold-500)] to-transparent opacity-60"
      />

    <div className="mx-auto flex max-w-xl flex-col items-center">
      <div
       aria-hidden="true"
       className="mb-6 flex size-14 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.1)]
text-[var(--color-gold-600)] shadow-[var(--shadow-gold-glow)]"
      >
       {icon ?? (
         <Gem className="size-6" />
       )}

      </div>

      <h2 className="font-heading text-3xl font-medium tracking-[-0.02em] text-foreground">
       {title}
      </h2>

      <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
       {description}
      </p>

     {action ? (
       <div className="mt-7">
         {action}
       </div>
     ) : null}
    </div>
   </section>
 );
}
