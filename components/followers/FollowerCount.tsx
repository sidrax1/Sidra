import {
  UsersRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface FollowerCountProps {
  readonly count: number;
  readonly label?: string;
  readonly className?: string;
}

export function FollowerCount({
  className,
  count,
  label = "collectors following",
}: FollowerCountProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm text-muted",
        className
      )}
    >
      <UsersRound
        aria-hidden="true"
        className="size-4 text-[var(--color-gold-600)]"
      />

      <strong className="font-medium text-foreground">
        {count.toLocaleString(
          "en-IN"
        )}
      </strong>

      {label}
    </span>
  );
}
