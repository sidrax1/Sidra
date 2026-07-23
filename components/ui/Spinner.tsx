import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  readonly label?: string;
  readonly size?: "sm" | "md" | "lg";
  readonly className?: string;
}

const sizeClasses = {
  sm: "size-4",
  md: "size-6",
  lg: "size-9",
} as const;

export function Spinner({
  className,
  label = "Loading",
  size = "md",
}: SpinnerProps): React.JSX.Element {
  return (
    <span
     role="status"
     aria-live="polite"
     className={cn(
       "inline-flex items-center gap-2 text-muted",
       className
     )}
    >
     <LoaderCircle
       aria-hidden={true}
       className={cn(
         "animate-spin text-[var(--color-gold-500)]",
         sizeClasses[size]
       )}
     />

    <span className="sidra-visually-hidden">{label}</span>
   </span>
 );
}
