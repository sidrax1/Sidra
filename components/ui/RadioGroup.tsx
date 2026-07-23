import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: ReactNode;
  disabled?: boolean;
}

interface RadioGroupProps {
  readonly name: string;
  readonly value?: string;
  readonly options: readonly RadioOption[];
  readonly onChange?: (value: string) => void;
  readonly className?: string;
}

export function RadioGroup({
  className,
  name,
  onChange,
  options,
  value,
}: RadioGroupProps): React.JSX.Element {
  return (
   <div
     role="radiogroup"
     className={cn("grid gap-3", className)}
   >
     {options.map((option) => (
      <label
        key={option.value}
        className={cn(
         "flex cursor-pointer items-start gap-3 rounded-md border p-4",

       "transition-[border-color,background-color,box-shadow] duration-[var(--duration-base)]",
       value === option.value
         ? "border-[var(--color-gold-500)] bg-[var(--color-gold-100)]/40shadow-[var(--shadow-card)]"
         : "border-border bg-card",
       option.disabled && "cursor-not-allowed opacity-45"
     )}
    >
     <input
       type="radio"
       name={name}
       value={option.value}
       checked={value === option.value}
       disabled={option.disabled}
       onChange={() => onChange?.(option.value)}
       className="mt-1 size-4 accent-[var(--color-gold-500)]"
     />

      <span className="grid gap-1">
       <span className="text-sm font-medium text-foreground">
        {option.label}
       </span>

         {option.description ? (
           <span className="text-sm leading-6 text-muted">
             {option.description}
           </span>
         ) : null}
        </span>
      </label>
    ))}
   </div>
 );
}
