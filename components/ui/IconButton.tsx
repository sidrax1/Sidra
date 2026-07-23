"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

import {
  cn,
} from "@/lib/utils";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly label: string;
  readonly icon: ReactNode;
  readonly size?: "sm" | "md" | "lg";
  readonly appearance?: "default" | "glass" | "ghost";
}

const sizeClasses = {
  sm: "size-9",
  md: "size-11",
  lg: "size-13",
} as const;

const appearanceClasses = {
 default: [
   "border-[color:rgb(200_169_106_/_0.35)]",
   "bg-[var(--color-ivory-50)]",
   "text-foreground",
   "shadow-[var(--shadow-card)]",
   "hover:border-[var(--color-gold-500)]",
   "hover:shadow-[var(--shadow-hover)]",
   "dark:bg-[var(--color-charcoal-800)]",
 ].join(" "),

 glass: [
   "sidra-glass",
   "text-[var(--color-ivory-100)]",
   "hover:border-[color:rgb(200_169_106_/_0.65)]",
   "hover:shadow-[var(--shadow-gold-glow)]",
 ].join(" "),

  ghost: [
    "border-transparent",
    "bg-transparent",
    "text-foreground",
    "hover:bg-[color:rgb(200_169_106_/_0.1)]",
  ].join(" "),
} as const;

export const IconButton = forwardRef<
 HTMLButtonElement,
 IconButtonProps

>(function IconButton(
  {
    appearance = "default",
    className,
    disabled,
    icon,
    label,
    size = "md",
    type = "button",
    ...props
  },
  forwardedRef
){
  return (
    <button
      ref={forwardedRef}
      type={type}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "sidra-transition inline-flex shrink-0 items-center justify-center rounded-full border",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "active:scale-[0.97]",
        "disabled:pointer-events-none disabled:opacity-45",
        "[&_svg]:size-5",
        sizeClasses[size],
        appearanceClasses[appearance],
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
});

IconButton.displayName = "IconButton";
