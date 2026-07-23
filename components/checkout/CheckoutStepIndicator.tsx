import {
  Check,
} from "lucide-react";

import {
  cn,
} from "@/lib/utils";

export interface CheckoutStep {
  readonly id: string;
  readonly label: string;
}

interface CheckoutStepIndicatorProps {
  readonly steps: readonly CheckoutStep[];

    readonly currentStepId: string;
    readonly completedStepIds?: ReadonlySet<string>;
    readonly className?: string;
}

export function CheckoutStepIndicator({
  className,
  completedStepIds,
  currentStepId,
  steps,
}: CheckoutStepIndicatorProps): React.JSX.Element {
  const currentIndex =
   steps.findIndex(
     (step) =>
      step.id === currentStepId
   );

    return (
     <nav
       aria-label="Checkout progress"
       className={cn(
         "overflow-x-auto",
         className
       )}
     >
       <ol className="flex min-w-max items-center">
         {steps.map(
          (
            step,
            index
          ) => {
            const completed =
              completedStepIds?.has(
                step.id
              ) ??
              index <
                currentIndex;

         const active =
          step.id ===
          currentStepId;

         return (
          <li

            key={step.id}
            className="flex items-center"
          >
            <div className="flex items-center gap-3">
             <span
               className={cn(
                 "flex size-9 items-center justify-center rounded-full border text-sm font-semibold",
                 completed &&
                   "border-[var(--color-success)] bg-[var(--color-success)] text-white",
                 active &&
                   !completed &&
                   "border-[var(--color-gold-500)] bg-[var(--color-gold-100)]text-[var(--color-gold-600)] shadow-[var(--shadow-gold-glow)]",
                 !active &&
                   !completed &&
                   "border-border bg-card text-muted"
               )}
             >
               {completed ? (
                 <Check
                   aria-hidden={true}
                   className="size-4"
                 />
               ):(
                 index + 1
               )}
             </span>

           <span
            className={cn(
              "text-sm font-medium",
              active ||
                completed
                ? "text-foreground"
                : "text-muted"
            )}
           >
            {step.label}
           </span>
          </div>

          {index <
          steps.length -
            1?(

             <span
               aria-hidden={true}
               className={cn(
                 "mx-5 h-px w-16",
                 completed
                  ? "bg-[var(--color-success)]"
                  : "bg-border"
               )}
             />
           ) : null}
          </li>
        );
       }
     )}
    </ol>
   </nav>
 );
}
