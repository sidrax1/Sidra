import {
  forwardRef,
  type InputHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  readonly label?: string;
  readonly description?: string;
}

export const Checkbox = forwardRef<

 HTMLInputElement,
 CheckboxProps
>(function Checkbox(
 {
   className,
   description,
   label,
   ...props
 },
 forwardedRef
){
 return (
   <label className="flex cursor-pointer items-start gap-3">
     <input
      ref={forwardedRef}
      type="checkbox"
      className={cn(
        "mt-1 size-4 rounded border-border accent-[var(--color-gold-500)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-500)]focus-visible:ring-offset-2",
        className
      )}
      {...props}
     />

    {label || description ? (
      <span className="grid gap-1">
       {label ? (
         <span className="text-sm font-medium text-foreground">
           {label}
         </span>
       ) : null}

         {description ? (
           <span className="text-sm leading-6 text-muted">
             {description}
           </span>
         ) : null}
       </span>
     ) : null}
    </label>
  );
});

Checkbox.displayName = "Checkbox";
