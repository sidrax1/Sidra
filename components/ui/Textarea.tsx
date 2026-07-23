import {
  forwardRef,
  type TextareaHTMLAttributes,
} from "react";

import {
  cn,
} from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  readonly invalid?: boolean;
}

export const Textarea = forwardRef<
 HTMLTextAreaElement,
 TextareaProps
>(function Textarea(
 {
   className,
   disabled,
   invalid = false,
   rows = 5,
   ...props
 },
 forwardedRef
){
 return (
   <textarea
     ref={forwardedRef}
     rows={rows}
     disabled={disabled}
     aria-invalid={
       invalid || undefined
     }
     className={cn(
       "flex min-h-32 w-full resize-y rounded-md border",
       "bg-[var(--color-ivory-50)] px-4 py-3",
       "text-base leading-relaxed text-[var(--color-black-900)]",
       "shadow-[var(--shadow-card)]",
       "placeholder:text-[var(--color-gray-500)]",

       "transition-[border-color,box-shadow,background-color] duration-[var(--duration-base)]",
       "ease-[var(--ease-luxury)]",
       "hover:border-[color:rgb(200_169_106_/_0.55)]",
       "focus-visible:border-[var(--color-gold-500)]",
       "focus-visible:outline-none",
       "focus-visible:ring-4",
       "focus-visible:ring-[color:rgb(200_169_106_/_0.14)]",
       "disabled:cursor-not-allowed disabled:opacity-50",
       "dark:bg-[var(--color-charcoal-800)] dark:text-[var(--color-ivory-100)]",
       invalid
         ? "border-[var(--color-error)] focus-visible:border-[var(--color-error)]focus-visible:ring-[color:rgb(140_59_52_/_0.14)]"
         : "border-[var(--color-gray-300)] dark:border-[var(--color-gray-700)]",
       className
     )}
     {...props}
    />
  );
});

Textarea.displayName = "Textarea";
