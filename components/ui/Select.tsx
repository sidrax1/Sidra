import {
  forwardRef,
  type SelectHTMLAttributes,
} from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  readonly options: readonly SelectOption[];
  readonly placeholder?: string;
  readonly invalid?: boolean;
}

export const Select = forwardRef<
 HTMLSelectElement,
 SelectProps
>(function Select(
 {
   className,
   invalid = false,
   options,
   placeholder,
   ...props
 },
 forwardedRef
){
 return (
   <div className="relative">
     <select
      ref={forwardedRef}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-12 w-full appearance-none rounded-md border bg-card px-4 pr-11 text-basetext-foreground shadow-[var(--shadow-card)]",
        "transition-[border-color,box-shadow] duration-[var(--duration-base)]",
        "focus-visible:outline-none focus-visible:ring-4",
        invalid
          ? "border-[var(--color-error)] focus-visible:ring-[color:rgb(140_59_52_/_0.14)]"
          : "border-border focus-visible:border-[var(--color-gold-500)]focus-visible:ring-[color:rgb(200_169_106_/_0.14)]",
        className
      )}
      {...props}
     >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}

     {options.map((option) => (
       <option
         key={option.value}
         value={option.value}
         disabled={option.disabled}
       >
         {option.label}
       </option>
     ))}
    </select>

     <ChevronDown
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2
text-muted"
     />
    </div>
  );
});

Select.displayName = "Select";
