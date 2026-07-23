import type {
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

interface AccountPanelProps {
  readonly children: ReactNode;
  readonly title?: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function AccountPanel({
  action,
  children,
  className,
  description,
  title,
}: AccountPanelProps): React.JSX.Element {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card",
        "shadow-[var(--shadow-card)]",
        className
      )}
    >
      {title || description || action ? (
        <header className="flex flex-col gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.04)] px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {title ? (
              <h2 className="font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
                {title}
              </h2>
            ) : null}

            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                {description}
              </p>
            ) : null}
          </div>

          {action}
        </header>
      ) : null}

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}
