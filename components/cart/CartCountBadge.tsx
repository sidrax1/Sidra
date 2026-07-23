import {
  cn,
} from "@/lib/utils";

interface CartCountBadgeProps {
  readonly count: number;
  readonly maximumDisplay?: number;
  readonly className?: string;
}

export function CartCountBadge({
  className,
  count,
  maximumDisplay = 99,
}: CartCountBadgeProps): React.JSX.Element | null {
  if (count <= 0) {
    return null;
  }

 const label =
  count > maximumDisplay
   ? `${maximumDisplay}+`
   : count.toLocaleString(
       "en-IN"
     );

 return (
  <span
    aria-label={`${count} items in cart`}
    className={cn(
      "inline-flex min-w-5 items-center justify-center rounded-full",
      "border border-[var(--color-black-900)] bg-[var(--color-gold-500)]",
      "px-1.5 py-0.5 text-[10px] font-bold leading-none text-[var(--color-black-900)]",
      className
    )}
  >
    {label}
  </span>

 );
}
