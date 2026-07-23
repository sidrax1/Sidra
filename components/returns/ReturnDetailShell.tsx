import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

interface ReturnDetailShellProps {
  readonly header: ReactNode;
  readonly primary: ReactNode;
  readonly sidebar?: ReactNode;
  readonly actions?: ReactNode;
  readonly navigation?: ReactNode;
  readonly className?: string;
}

export function ReturnDetailShell({
  actions,
  className,
  header,
  navigation,
  primary,
  sidebar,
}: ReturnDetailShellProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "min-h-screen bg-background pb-20 pt-28",
        className
      )}
    >
      <Container>
        {navigation ? (
          <div className="mb-6">{navigation}</div>
        ) : null}

        {header}

        {actions ? (
          <div className="mt-6 flex flex-wrap justify-end gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            {actions}
          </div>
        ) : null}

        <div
          className={cn(
            "mt-8 grid gap-8",
            sidebar &&
              "xl:grid-cols-[minmax(0,1fr)_390px]"
          )}
        >
          <main className="min-w-0">{primary}</main>

          {sidebar ? (
            <aside className="min-w-0">
              <div className="grid gap-6 xl:sticky xl:top-24">
                {sidebar}
              </div>
            </aside>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
