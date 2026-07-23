import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AccountSectionProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly children: ReactNode;

    readonly className?: string;
}

export function AccountSection({
  action,
  children,
  className,
  description,
  title,
}: AccountSectionProps): React.JSX.Element {
  return (
    <section
      className={cn(
        "grid gap-6",
        className
      )}
    >
      <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row
sm:items-end sm:justify-between">
        <div>
         <h2 className="font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
           {title}
         </h2>

         {description ? (
           <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
             {description}
           </p>
         ) : null}
        </div>

       {action ? (
         <div className="shrink-0">
           {action}
         </div>
       ) : null}
      </header>

       {children}
      </section>
    );
}
