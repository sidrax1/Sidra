import {
  forwardRef,
  type HTMLAttributes,
} from "react";

import {
  cva,
  type VariantProps,
} from "class-variance-authority";

import {

  cn,
} from "@/lib/utils";

const badgeVariants = cva(
 [
   "inline-flex",
   "items-center",
   "justify-center",
   "whitespace-nowrap",
   "rounded-full",
   "border",
   "px-3",
   "py-1",
   "text-xs",
   "font-medium",
   "tracking-[0.04em]",
   "transition-colors",
   "duration-[var(--duration-base)]",
   "ease-[var(--ease-luxury)]",
 ],
 {
   variants: {
     variant: {
      gold: [
        "border-[color:rgb(200_169_106_/_0.35)]",
        "bg-[color:rgb(200_169_106_/_0.12)]",
        "text-[var(--color-gold-600)]",
        "dark:text-[var(--color-gold-500)]",
      ],

     neutral: [
       "border-[var(--color-gray-300)]",
       "bg-[var(--color-ivory-50)]",
       "text-[var(--color-gray-700)]",
       "dark:border-[var(--color-gray-700)]",
       "dark:bg-[var(--color-charcoal-800)]",
       "dark:text-[var(--color-gray-300)]",
     ],

     success: [
       "border-[color:rgb(62_107_82_/_0.3)]",
       "bg-[color:rgb(62_107_82_/_0.1)]",
       "text-[var(--color-success)]",
     ],

        warning: [
          "border-[color:rgb(166_124_46_/_0.3)]",
          "bg-[color:rgb(166_124_46_/_0.1)]",
          "text-[var(--color-warning)]",
        ],

        error: [
          "border-[color:rgb(140_59_52_/_0.3)]",
          "bg-[color:rgb(140_59_52_/_0.1)]",
          "text-[var(--color-error)]",
        ],

          outline: [
            "border-current",
            "bg-transparent",
            "text-foreground",
          ],
        },
      },

      defaultVariants: {
        variant: "gold",
      },
  }
);

export interface BadgeProps
 extends HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<
 HTMLSpanElement,
 BadgeProps
>(function Badge(
 {
   className,
   variant,
   ...props
 },
 forwardedRef
){
 return (
   <span

     ref={forwardedRef}
     className={cn(
       badgeVariants({
         variant,
       }),
       className
     )}
     {...props}
    />
  );
});

Badge.displayName = "Badge";

export {
  badgeVariants,
};
