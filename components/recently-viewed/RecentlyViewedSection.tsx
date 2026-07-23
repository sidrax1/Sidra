import type {
  ReactNode,
} from "react";
import {
  Clock3,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface RecentlyViewedSectionProps {
  readonly children: ReactNode;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function RecentlyViewedSection({
  action,
  children,
  className,
}: RecentlyViewedSectionProps): React.JSX.Element {
  return (
    <section
      className={cn(
        "grid gap-6",
        className
      )}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            <Clock3
              aria-hidden={true}
              className="size-4"
            />
            Your Recent Journey
          </p>

          <h2 className="mt-2 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
            Recently Viewed
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Return to exceptional pieces you explored across Sidra.
          </p>
        </div>

        {action}
      </header>

      {children}
    </section>
  );
}
