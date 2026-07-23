import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

interface CustomOrderDetailShellProps {
  readonly header: ReactNode;
  readonly primary: ReactNode;
  readonly sidebar?: ReactNode;
  readonly navigation?: ReactNode;
  readonly className?: string;
}

export function CustomOrderDetailShell({
  className,
  header,
  navigation,
  primary,
  sidebar,
}: CustomOrderDetailShellProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "min-h-screen bg-background pb-20 pt-28 text-foreground",
        className
      )}
    >
      <Container>
        {navigation ? (
          <div className="mb-6">
            {navigation}
          </div>
        ) : null}

        {header}

        <div
          className={cn(
            "mt-8 grid gap-8",
            sidebar &&
              "xl:grid-cols-[minmax(0,1fr)_380px]"
          )}
        >
          <main className="min-w-0">
            {primary}
          </main>

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
