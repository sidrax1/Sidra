import {
  forwardRef,
  type LabelHTMLAttributes,
} from "react";

import {
  cn,
} from "@/lib/utils";

export interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> {
  readonly required?: boolean;
  readonly optional?: boolean;
}

export const Label = forwardRef<

 HTMLLabelElement,
 LabelProps
>(function Label(
 {
   children,
   className,
   optional = false,
   required = false,
   ...props
 },
 forwardedRef
){
 return (
   <label
     ref={forwardedRef}
     className={cn(
       "inline-flex items-center gap-1.5",
       "text-sm font-medium leading-none text-foreground",
       "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
       className
     )}
     {...props}
   >
     <span>
       {children}
     </span>

   {required ? (
     <span
       aria-hidden="true"
       className="text-[var(--color-error)]"
     >
       *
     </span>
   ) : null}

     {optional ? (
       <span className="text-xs font-normal text-muted">
         Optional
       </span>
     ) : null}
    </label>
  );
});

Label.displayName = "Label";
