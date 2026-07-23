"use client";

import { ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ReviewHelpfulButtonProps {
  readonly helpful: boolean;
  readonly helpfulCount: number;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onToggle: () => void | Promise<void>;
}

export function ReviewHelpfulButton({
  className,
  helpful,
  helpfulCount,
  loading = false,
  onToggle,
}: ReviewHelpfulButtonProps): React.JSX.Element {
  return (
    <Button
      variant={
        helpful
          ? "outline"
          : "ghost"
      }
      size="sm"
      disabled={loading}
      loading={loading}
      loadingLabel="Updating"
      aria-pressed={helpful}
      className={cn(
        helpful &&
          "border-[var(--color-gold-500)] bg-[var(--color-gold-100)] text-[var(--color-gold-600)]",
        className
      )}
      onClick={() => {
        void onToggle();
      }}
    >
      <ThumbsUp
        aria-hidden={true}
        className={cn(
          "size-4",
          helpful &&
            "fill-current"
        )}
      />

      Helpful

      <span className="rounded-full bg-background px-2 py-0.5 text-xs">
        {helpfulCount.toLocaleString(
          "en-IN"
        )}
      </span>
    </Button>
  );
}
