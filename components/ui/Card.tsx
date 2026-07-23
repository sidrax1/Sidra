import {
  forwardRef,
  type HTMLAttributes,
} from "react";

import {
  cn,
} from "@/lib/utils";

export const Card = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function Card(
  {
    className,
    ...props
  },
  forwardedRef
){
  return (
    <div
      ref={forwardedRef}
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-card shadow-card",
        "transition-[transform,box-shadow,border-color] duration-base ease-luxury",
        "hover:border-primary/30 hover:shadow-hover",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export const CardHeader = forwardRef<
 HTMLDivElement,
 HTMLAttributes<HTMLDivElement>
>(function CardHeader(
 {

    className,
    ...props
  },
  forwardedRef
){
  return (
    <div
      ref={forwardedRef}
      className={cn(
        "flex flex-col gap-2 p-6",
        className
      )}
      {...props}
    />
  );
});

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(function CardTitle(
  {
    className,
    ...props
  },
  forwardedRef
){
  return (
    <h3
      ref={forwardedRef}
      className={cn(
        "font-heading text-2xl font-medium leading-tight tracking-[-0.01em] text-foreground",
        className
      )}
      {...props}
    />
  );
});

CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<

  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardDescription(
  {
    className,
    ...props
  },
  forwardedRef
){
  return (
    <p
      ref={forwardedRef}
      className={cn(
        "text-sm leading-relaxed text-muted",
        className
      )}
      {...props}
    />
  );
});

CardDescription.displayName =
 "CardDescription";

export const CardContent = forwardRef<
 HTMLDivElement,
 HTMLAttributes<HTMLDivElement>
>(function CardContent(
 {
   className,
   ...props
 },
 forwardedRef
){
 return (
   <div
     ref={forwardedRef}
     className={cn(
       "px-6 pb-6",
       className
     )}
     {...props}
   />
 );

});

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function CardFooter(
  {
    className,
    ...props
  },
  forwardedRef
){
  return (
    <div
      ref={forwardedRef}
      className={cn(
        "flex items-center gap-3 border-t border-border px-6 py-4",
        className
      )}
      {...props}
    />
  );
});

CardFooter.displayName = "CardFooter";
