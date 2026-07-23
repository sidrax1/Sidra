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

const containerVariants = cva(
 [
   "mx-auto w-full",
   "px-[var(--grid-gutter-mobile)]",
   "md:px-[var(--grid-gutter-desktop)]",
 ],
 {
   variants: {
    size: {
     narrow:
       "max-w-3xl",

        content:
         "max-w-6xl",

        wide:
         "max-w-[var(--content-max-width)]",

         full:
          "max-w-none",
       },

       spacing: {
        none:
         "",

        sm:
         "py-8 md:py-10",

        md:
         "py-12 md:py-16",

        lg:
          "py-16 md:py-24",

          xl:
           "py-20 md:py-32",
        },
      },

      defaultVariants: {
        size: "wide",
        spacing: "none",
      },
  }
);

export interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>,
   VariantProps<typeof containerVariants> {
  readonly as?: "div" | "section" | "main" | "article";
}

export const Container = forwardRef<
 HTMLDivElement,
 ContainerProps

>(function Container(
  {
    as: Component = "div",
    className,
    size,
    spacing,
    ...props
  },
  forwardedRef
){
  return (
    <Component
      ref={forwardedRef}
      className={cn(
        containerVariants({
          size,
          spacing,
        }),
        className
      )}
      {...props}
    />
  );
});

Container.displayName = "Container";

export {
  containerVariants,
};
