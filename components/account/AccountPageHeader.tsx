import type {
  ReactNode,
} from "react";

import { AccountMobileNavigation } from "@/components/account/AccountMobileNavigation";
import { cn } from "@/lib/utils";

interface AccountPageHeaderProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function AccountPageHeader({
  action,
  className,
  description,
  eyebrow,
  title,
}: AccountPageHeaderProps): React.JSX.Element {
  return (
    <header
      className={cn(
        "flex flex-col gap-5 rounded-[var(--radius-xl)] border",
        "border-[color:rgb(200_169_106_/_0.24)] bg-card p-6",
        "shadow-[var(--shadow-card)] sm:flex-row sm:items-end sm:justify-between md:p-8",
        className
      )}
    >
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-2 font-heading text-[clamp(2.4rem,5vw,4.8rem)] font-medium leading-[0.96] tracking-[-0.05em] text-foreground">
          {title}
        </h1>

        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <AccountMobileNavigation />
        {action}
      </div>
    </header>
  );
}
