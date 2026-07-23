import type {
  ReactNode,
} from "react";

import {
  Surface,
} from "@/components/ui/Surface";

import {
  cn,
} from "@/lib/utils";

interface CheckoutSectionProps {
  readonly title: string;
  readonly description?: string;
  readonly number?: number;
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;

}

export function CheckoutSection({
  action,
  children,
  className,
  description,
  number,
  title,
}: CheckoutSectionProps): React.JSX.Element {
  return (
    <Surface
      padding="none"
      className={cn(
        "overflow-hidden",
        className
      )}
    >
      <header className="flex flex-col gap-4 border-b border-border px-6 py-5 sm:flex-row
sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
         {typeof number ===
         "number" ? (
           <span className="flex size-9 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.32)] bg-[var(--color-gold-100)] text-sm font-semibold
text-[var(--color-gold-600)]">
             {number}
           </span>
         ) : null}

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
     </div>

     {action ? (

         <div className="shrink-0">
           {action}
         </div>
       ) : null}
      </header>

    <div className="p-6">
     {children}
    </div>
   </Surface>
 );
}
