import type {
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

interface AccountMetricCardProps {
  readonly label: string;
  readonly value: string;
  readonly description?: string;
  readonly icon: ReactNode;
  readonly trend?: string;
  readonly className?: string;
}

export function AccountMetricCard({
  className,
  description,
  icon,
  label,
  trend,
  value,
}: AccountMetricCardProps): React.JSX.Element {
  return (
    <article
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-card)]",
        "transition-[transform,border-color,box-shadow] duration-[var(--duration-base)]",
        "hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.36)] hover:shadow-[var(--shadow-hover)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.07)] text-[var(--color-gold-600)]">
          {icon}
        </span>

        {trend ? (
          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted">
            {trend}
          </span>
        ) : null}
      </div>

      <p className="mt-5 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
        {value}
      </p>

      <h3 className="mt-3 text-sm font-medium text-foreground">
        {label}
      </h3>

      {description ? (
        <p className="mt-1 text-xs leading-5 text-muted">
          {description}
        </p>
      ) : null}
    </article>
  );
}
