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

const surfaceVariants = cva(
 [
   "relative",
   "border",
   "transition-[border-color,box-shadow,transform]",
   "duration-[var(--duration-base)]",
   "ease-[var(--ease-luxury)]",
 ],
 {
   variants: {
     variant: {
      ivory: [
        "border-[var(--color-gray-300)]",
        "bg-[var(--color-ivory-50)]",
        "text-[var(--color-black-900)]",
        "dark:border-[var(--color-gray-700)]",
        "dark:bg-[var(--color-charcoal-800)]",
        "dark:text-[var(--color-ivory-100)]",
      ],

     dark: [
       "border-[color:rgb(200_169_106_/_0.2)]",
       "bg-[var(--color-black-900)]",
       "text-[var(--color-ivory-100)]",
     ],

     glass: [
      "sidra-glass",

          "text-[var(--color-ivory-100)]",
        ],

         transparent: [
           "border-transparent",
           "bg-transparent",
           "text-foreground",
         ],
       },

       radius: {
         sm: "rounded-sm",
         md: "rounded-md",
         lg: "rounded-lg",
         xl: "rounded-[var(--radius-xl)]",
       },

       shadow: {
         none: "shadow-none",
         card: "shadow-[var(--shadow-card)]",
         hover: "shadow-[var(--shadow-hover)]",
         modal: "shadow-[var(--shadow-modal)]",
       },

        padding: {
          none: "p-0",
          sm: "p-4",
          md: "p-6",
          lg: "p-8",
          xl: "p-10",
        },
      },

      defaultVariants: {
        variant: "ivory",
        radius: "lg",
        shadow: "card",
        padding: "md",
      },
  }
);

export interface SurfaceProps
 extends HTMLAttributes<HTMLDivElement>,

  VariantProps<typeof surfaceVariants> {}

export const Surface = forwardRef<
  HTMLDivElement,
  SurfaceProps
>(function Surface(
  {
    className,
    padding,
    radius,
    shadow,
    variant,
    ...props
  },
  forwardedRef
){
  return (
    <div
      ref={forwardedRef}
      className={cn(
        surfaceVariants({
          padding,
          radius,
          shadow,
          variant,
        }),
        className
      )}
      {...props}
    />
  );
});

Surface.displayName = "Surface";

export {
  surfaceVariants,
};
