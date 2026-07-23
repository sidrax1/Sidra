import type {
  ReactNode,
} from "react";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

interface AccountDashboardShellProps {
  readonly sidebar: ReactNode;
  readonly header: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}

export function AccountDashboardShell({
  children,
  className,
  header,
  sidebar,
}: AccountDashboardShellProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "min-h-screen bg-background pb-20 pt-24 text-foreground",
        className
      )}
    >
      <Container>
        {header}

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="min-w-0">
            <div className="lg:sticky lg:top-24">
              {sidebar}
            </div>
          </aside>

          <main className="min-w-0">
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}
