import {
  ShieldAlert,
  XCircle,
} from "lucide-react";

import {
  EmptyState,
} from "@/components/ui/EmptyState";
import {
  cn,
} from "@/lib/utils";
import type {
  WarrantyExclusion,
} from "@/types/warranty";

interface WarrantyExclusionListProps {
  readonly exclusions: readonly WarrantyExclusion[];
  readonly className?: string;
}

export function WarrantyExclusionList({
  className,
  exclusions,
}: WarrantyExclusionListProps): React.JSX.Element {
  if (exclusions.length === 0) {
    return (
      <EmptyState
        title="No specific exclusions"
        description="Standard marketplace and product-care terms still apply."
      />
    );
  }

  return (
    <section
      aria-label="Warranty exclusions"
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-start gap-4 border-b border-border bg-[color:rgb(145_59_59_/_0.05)] p-6">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:rgb(145_59_59_/_0.28)] bg-[color:rgb(145_59_59_/_0.07)] text-[var(--color-error)]">
          <ShieldAlert
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[var(--color-error)]">
            Coverage Limitations
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Warranty Exclusions
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            Claims involving the following conditions may not qualify
            for warranty coverage.
          </p>
        </div>
      </header>

      <div className="grid gap-4 p-6 md:grid-cols-2">
        {exclusions.map(
          (
            exclusion,
            index
          ) => (
            <article
              key={exclusion.id}
              className="rounded-[var(--radius-lg)] border border-border bg-background p-5"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[color:rgb(145_59_59_/_0.25)] bg-[color:rgb(145_59_59_/_0.06)] text-[var(--color-error)]">
                  <XCircle
                    aria-hidden={true}
                    className="size-4"
                  />
                </span>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Exclusion{" "}
                    {index + 1}
                  </p>

                  <h3 className="mt-2 font-medium text-foreground">
                    {
                      exclusion.title
                    }
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {
                      exclusion.description
                    }
                  </p>
                </div>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}
