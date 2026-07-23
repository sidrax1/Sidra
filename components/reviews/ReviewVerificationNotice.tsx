import {
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface ReviewVerificationNoticeProps {
  readonly verified: boolean;
  readonly className?: string;
}

export function ReviewVerificationNotice({
  className,
  verified,
}: ReviewVerificationNoticeProps): React.JSX.Element {
  return (
    <aside
      className={cn(
        "flex items-start gap-4 rounded-[var(--radius-lg)] border p-5",
        verified
          ? "border-[color:rgb(62_107_82_/_0.28)] bg-[color:rgb(62_107_82_/_0.07)]"
          : "border-border bg-background",
        className
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card">
        {verified ? (
          <BadgeCheck
            aria-hidden={true}
            className="size-5 text-[var(--color-success)]"
          />
        ) : (
          <ShieldCheck
            aria-hidden={true}
            className="size-5 text-muted"
          />
        )}
      </span>

      <div>
        <h3 className="text-sm font-medium text-foreground">
          {verified
            ? "Verified purchase"
            : "Purchase verification pending"}
        </h3>

        <p className="mt-1 text-xs leading-6 text-muted">
          {verified
            ? "This review is linked to a completed Sidra order and was verified server-side."
            : "This review is not publicly marked as verified until the related order is confirmed."}
        </p>
      </div>
    </aside>
  );
}
