import type {
  ReactNode,
} from "react";

import {
  cn,
} from "@/lib/utils";

interface MessagingShellProps {
  readonly sidebar: ReactNode;
  readonly header: ReactNode;
  readonly thread: ReactNode;
  readonly composer: ReactNode;
  readonly className?: string;
}

export function MessagingShell({
  className,
  composer,
  header,
  sidebar,
  thread,
}: MessagingShellProps): React.JSX.Element {
  return (
   <section
     className={cn(
       "grid min-h-[720px] overflow-hidden rounded-[var(--radius-xl)] border border-borderbg-card",
       "shadow-[var(--shadow-hover)] lg:grid-cols-[340px_minmax(0,1fr)]",
       className
     )}
   >

      <aside className="border-b border-border bg-background p-4 lg:border-b-0 lg:border-r">
       {sidebar}
      </aside>

    <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto]">
     {header}
     {thread}
     {composer}
    </div>
   </section>
 );
}
