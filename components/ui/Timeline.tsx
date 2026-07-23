import type {
  ReactNode,
} from "react";

import {
  Check,
} from "lucide-react";

import {
  cn,
} from "@/lib/utils";

export interface TimelineItem {
  readonly id: string;
  readonly title: string;
  readonly description?: ReactNode;
  readonly timestamp?: string;
  readonly completed?: boolean;
  readonly active?: boolean;
  readonly icon?: ReactNode;
}

interface TimelineProps {
  readonly items: readonly TimelineItem[];
  readonly className?: string;
}

export function Timeline({
  className,
  items,
}: TimelineProps): React.JSX.Element {
  return (
    <ol
     className={cn(
       "relative grid gap-8",
       className
     )}
    >
     {items.map((item, index) => {
       const last =
         index === items.length - 1;

     return (
      <li
        key={item.id}
        className="relative grid grid-cols-[40px_1fr] gap-4"
      >
        {!last ? (

         <span
           aria-hidden="true"
           className="absolute left-[19px] top-10 h-[calc(100%+8px)] w-px bg-border"
         />
       ) : null}

      <span
       className={cn(
         "relative z-10 flex size-10 items-center justify-center rounded-full border",
         item.completed &&
           "border-[var(--color-success)] bg-[var(--color-success)] text-white",
         item.active &&
           !item.completed &&
           "border-[var(--color-gold-500)] bg-[var(--color-gold-100)] text-[var(--color-gold-600)]shadow-[var(--shadow-gold-glow)]",
         !item.completed &&
           !item.active &&
           "border-border bg-card text-muted"
       )}
      >
       {item.icon ??
         (item.completed ? (
           <Check
             aria-hidden="true"
             className="size-4"
           />
         ):(
           <span className="size-2 rounded-full bg-current" />
         ))}
      </span>

       <div className="pt-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
         <h3 className="font-medium text-foreground">
           {item.title}
         </h3>

          {item.timestamp ? (
            <time className="text-xs text-muted">
              {item.timestamp}
            </time>
          ) : null}
         </div>

           {item.description ? (
             <div className="mt-2 text-sm leading-6 text-muted">
               {item.description}
             </div>
           ) : null}
         </div>
        </li>
      );
    })}
   </ol>
 );
}
