"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";

import {
  Slot,
} from "@radix-ui/react-slot";

import {
  cva,
  type VariantProps,
} from "class-variance-authority";

import {
  LoaderCircle,
} from "lucide-react";

import {
  cn,
} from "@/lib/utils";

const buttonVariants = cva(
 [
   "sidra-transition",
   "relative",
   "inline-flex",
   "select-none",
   "items-center",
   "justify-center",
   "gap-2",
   "whitespace-nowrap",
   "font-medium",
   "tracking-[0.01em]",
   "outline-none",
   "focus-visible:ring-2",
   "focus-visible:ring-primary",
   "focus-visible:ring-offset-2",
   "focus-visible:ring-offset-background",
   "disabled:pointer-events-none",
   "disabled:cursor-not-allowed",
   "disabled:opacity-45",
   "[&_svg]:pointer-events-none",
   "[&_svg]:shrink-0",
 ],
 {
   variants: {
     variant: {
      primary: [
        "border",
        "border-primary",
        "bg-primary",
        "text-black-900",
        "shadow-card",
        "hover:border-primary-dark",
        "hover:bg-[var(--color-gold-600)]",
        "hover:shadow-hover",
        "active:scale-[0.985]",
      ],

     secondary: [
      "border",
      "border-gray-300",
      "bg-ivory-50",
      "text-black-900",
      "shadow-card",

   "hover:border-primary/50",
   "hover:bg-gold-100/40",
   "hover:shadow-hover",
   "active:scale-[0.985]",
   "dark:border-gray-700",
   "dark:bg-charcoal-800",
   "dark:text-ivory-100",
 ],

 outline: [
   "border",
   "border-primary/55",
   "bg-transparent",
   "text-foreground",
   "hover:border-primary",
   "hover:bg-primary/10",
   "hover:shadow-gold-glow",
   "active:scale-[0.985]",
 ],

 ghost: [
   "border",
   "border-transparent",
   "bg-transparent",
   "text-foreground",
   "hover:bg-primary/10",
   "hover:text-foreground",
   "active:scale-[0.985]",
 ],

  danger: [
    "border",
    "border-error",
    "bg-error",
    "text-ivory-50",
    "shadow-card",
    "hover:brightness-95",
    "hover:shadow-hover",
    "active:scale-[0.985]",
  ],
},

size: {
 sm: [

           "h-9",
           "rounded-full",
           "px-4",
           "text-sm",
           "[&_svg]:size-4",
         ],

         md: [
           "h-11",
           "rounded-full",
           "px-6",
           "text-sm",
           "[&_svg]:size-4",
         ],

         lg: [
           "h-13",
           "rounded-full",
           "px-8",
           "text-base",
           "[&_svg]:size-5",
         ],

         icon: [
           "size-11",
           "rounded-full",
           "p-0",
           "[&_svg]:size-5",
         ],
       },

        fullWidth: {
          true: "w-full",
          false: "",
        },
      },

      defaultVariants: {
        variant: "primary",
        size: "md",
        fullWidth: false,
      },
  }
);

export interface ButtonProps
 extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
 readonly asChild?: boolean;

    readonly loading?: boolean;

    readonly loadingLabel?: string;
}

export const Button = forwardRef<
 HTMLButtonElement,
 ButtonProps
>(function Button(
 {
   asChild = false,
   children,
   className,
   disabled,
   fullWidth,
   loading = false,
   loadingLabel = "Please wait",
   size,
   type = "button",
   variant,
   ...props
 },
 forwardedRef
){
 const Component =
   asChild ? Slot : "button";

    return (
     <Component
       ref={forwardedRef}
       className={cn(
         buttonVariants({
           variant,
           size,
           fullWidth,
         }),
         className
       )}

   disabled={
     asChild
       ? undefined
       : disabled || loading
   }
   aria-busy={
     loading || undefined
   }
   aria-disabled={
     disabled || loading || undefined
   }
   type={
     asChild
       ? undefined
       : type
   }
   {...props}
  >
   {loading ? (
     <>
       <LoaderCircle
         aria-hidden={true}
         className="animate-spin"
       />

        <span>
         {loadingLabel}
        </span>
       </>
     ):(
       children
     )}
    </Component>
  );
});

Button.displayName = "Button";

export {
  buttonVariants,
};
