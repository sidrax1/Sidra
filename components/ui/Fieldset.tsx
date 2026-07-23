import type {
  FieldsetHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

interface FieldsetProps
  extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  readonly legend: string;
  readonly description?: ReactNode;
}

export function Fieldset({
 children,
 className,
 description,
 legend,
 ...props

}: FieldsetProps): React.JSX.Element {
  return (
   <fieldset
     className={cn(
       "rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-card)]",
       className
     )}
     {...props}
   >
     <legend className="px-2 font-heading text-2xl font-medium text-foreground">
       {legend}
     </legend>

      {description ? (
        <div className="mb-6 mt-1 text-sm leading-6 text-muted">
          {description}
        </div>
      ) : null}

    <div className="grid gap-5">{children}</div>
   </fieldset>
 );
}
