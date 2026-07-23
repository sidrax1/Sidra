import {
  cn,
} from "@/lib/utils";

import {
  clamp,
} from "@/lib/number";

interface StatBarProps {
  readonly label: string;
  readonly value: number;
  readonly maximum: number;
  readonly formattedValue?: string;
  readonly className?: string;
}

export function StatBar({
  className,
  formattedValue,
  label,
  maximum,
  value,
}: StatBarProps): React.JSX.Element {
  const safeMaximum =
    maximum > 0 ? maximum : 1;

 const percentage = clamp(
  (value / safeMaximum) * 100,
  0,
  100

 );

 return (
  <div
    className={cn(
      "grid gap-2",
      className
    )}
  >
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="font-medium text-foreground">
       {label}
      </span>

       <span className="text-muted">
        {formattedValue ?? value}
       </span>
      </div>

     <div className="h-2 overflow-hidden rounded-full bg-[var(--color-gray-100)]
dark:bg-[var(--color-gray-700)]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold-600)]
via-[var(--color-gold-500)] to-[var(--color-gold-100)] transition-[width]
duration-[var(--duration-slow)] ease-[var(--ease-luxury)]"
        style={{
          width: `${percentage}%`,
        }}
      />
     </div>
    </div>
  );
}
