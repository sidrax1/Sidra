import type { ReactNode } from "react";

import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/LogoMark";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}

export function AdminShell({
  action,
  children,
  className,
  description,
  title,
}: AdminShellProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "min-h-screen bg-background pb-20 pt-24 text-foreground",
        className
      )}
    >
      <Container>
        <div className="mb-8 flex items-center justify-between gap-6 border-b border-border
pb-6">
         <LogoMark size="sm" />

      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
       Administration
      </p>
     </div>

      <header className="mb-10 flex flex-col gap-6 border-b border-border pb-8 md:flex-row
md:items-end md:justify-between">
       <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em]
text-[var(--color-gold-600)]">
          Sidra Control Centre

        </p>

       <h1 className="mt-3 font-heading text-[clamp(2.7rem,6vw,5rem)] font-medium
leading-[0.95] tracking-[-0.05em]">
         {title}
       </h1>

        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            {description}
          </p>
        ) : null}
       </div>

       {action ? (
         <div className="shrink-0">{action}</div>
       ) : null}
      </header>

      <div className="grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">
       <AdminNavigation />

       <main className="min-w-0">{children}</main>
     </div>
    </Container>
   </div>
 );
}
