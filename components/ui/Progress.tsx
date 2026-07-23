import { cn } from "@/lib/utils";
import { clamp } from "@/lib/number";

interface ProgressProps {
  readonly value: number;
  readonly max?: number;
  readonly label?: string;
  readonly showValue?: boolean;
  readonly className?: string;
}

export function Progress({
  className,
  label = "Progress",
  max = 100,
  showValue = false,
  value,
}: ProgressProps): React.JSX.Element {
  const safeMax = max > 0 ? max : 100;
  const percentage = clamp((value / safeMax) * 100, 0, 100);

 return (
  <div className={cn("w-full", className)}>
    {showValue ? (
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span>{label}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
    ) : null}

     <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clamp(value, 0, safeMax)}
      className="h-2 overflow-hidden rounded-full bg-[var(--color-gray-100)]
dark:bg-[var(--color-gray-700)]"
     >
      <div
        className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold-600)]
to-[var(--color-gold-500)] transition-[width] duration-[var(--duration-slow)]
ease-[var(--ease-luxury)]"
        style={{ width: `${percentage}%` }}
      />
     </div>
    </div>
  );
}
