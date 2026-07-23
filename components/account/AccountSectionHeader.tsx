import type {
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

interface AccountSectionHeaderProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function AccountSectionHeader({
  action,
  className,
  description,
  eyebrow,
  title,
}: AccountSectionHeaderProps): React.JSX.Element {
  return (
    <header
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            {eyebrow}
          </p>
        ) : null}

        <h2 className="mt-2 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
          {title}
        </h2>

        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {description}
          </p>
        ) : null}
      </div>

      {action}
    </header>
  );
}
