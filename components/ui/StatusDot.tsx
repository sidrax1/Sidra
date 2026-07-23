import { cn } from "@/lib/utils";

interface StatusDotProps {
  readonly status?: "online" | "offline" | "pending" | "error";
  readonly label?: string;
  readonly pulse?: boolean;
  readonly className?: string;
}

const statusClasses = {
  online: "bg-[var(--color-success)]",
  offline: "bg-[var(--color-gray-500)]",
  pending: "bg-[var(--color-warning)]",
  error: "bg-[var(--color-error)]",
} as const;

export function StatusDot({
  className,
  label,
  pulse = false,
  status = "online",
}: StatusDotProps): React.JSX.Element {
  return (
    <span
     className={cn(
      "inline-flex items-center gap-2 text-sm text-muted",

      className
    )}
  >
    <span className="relative flex size-2.5">
      {pulse && status === "online" ? (
        <span className="absolute inline-flex size-full animate-ping rounded-full
bg-[var(--color-success)] opacity-50" />
      ) : null}

       <span
        className={cn(
          "relative inline-flex size-2.5 rounded-full",
          statusClasses[status]
        )}
        aria-hidden={true}
       />
      </span>

    {label ? <span>{label}</span> : null}
   </span>
 );
}
