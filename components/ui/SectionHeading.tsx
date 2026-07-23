import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  readonly eyebrow?: string;
  readonly title: ReactNode;
  readonly description?: ReactNode;

    readonly action?: ReactNode;
    readonly alignment?: "left" | "center";
    readonly className?: string;
}

export function SectionHeading({
  action,
  alignment = "left",
  className,
  description,
  eyebrow,
  title,
}: SectionHeadingProps): React.JSX.Element {
  return (
    <header
      className={cn(
        "flex flex-col gap-6",
        alignment === "center"
          ? "items-center text-center"
          : "items-start text-left",
        action && "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div
        className={cn(
          "max-w-3xl",
          alignment === "center" && "mx-auto"
        )}
      >
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em]
text-[var(--color-gold-600)] dark:text-[var(--color-gold-500)]">
            {eyebrow}
          </p>
        ) : null}

     <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.05]
tracking-[-0.035em] text-foreground">
       {title}
     </h2>

        {description ? (
         <div className="mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg">

           {description}
         </div>
       ) : null}
      </div>

    {action ? (
      <div className="shrink-0">{action}</div>
    ) : null}
   </header>
 );
}
