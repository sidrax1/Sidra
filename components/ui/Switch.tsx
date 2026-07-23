"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
  readonly label: string;
  readonly description?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function Switch({
  checked,
  className,
  description,
  disabled = false,
  label,
  onCheckedChange,
}: SwitchProps): React.JSX.Element {
  return (
    <label
     className={cn(
       "flex items-start justify-between gap-6",
       disabled && "opacity-45",
       className
     )}
    >
     <span className="grid gap-1">
       <span className="text-sm font-medium text-foreground">
         {label}
       </span>

    {description ? (
      <span className="text-sm leading-6 text-muted">
        {description}
      </span>
    ) : null}
   </span>

   <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}

       onClick={() => onCheckedChange(!checked)}
       className={cn(
         "relative h-7 w-12 shrink-0 rounded-full border transition-colorsduration-[var(--duration-base)]",
         checked
           ? "border-[var(--color-gold-500)] bg-[var(--color-gold-500)]"
           : "border-border bg-[var(--color-gray-300)] dark:bg-[var(--color-gray-700)]",
         "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-500)]focus-visible:ring-offset-2"
       )}
     >
       <span
         className={cn(
           "absolute top-0.5 size-5 rounded-full bg-white shadow transition-transformduration-[var(--duration-base)]",
           checked ? "translate-x-6" : "translate-x-0.5"
         )}
       />
     </button>
    </label>
  );
}
