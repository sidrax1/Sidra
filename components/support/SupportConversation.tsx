import type {
  ReactNode,
} from "react";

import {
  cn,
} from "@/lib/utils";

interface SupportConversationProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function SupportConversation({
  children,
  className,
}: SupportConversationProps): React.JSX.Element {
  return (
   <section
     aria-label="Support conversation"
     className={cn(

      "grid gap-5 rounded-[var(--radius-lg)] border border-border bg-card p-5",
      "shadow-[var(--shadow-card)] md:p-6",
      className
    )}
   >
    {children}
   </section>
 );
}
