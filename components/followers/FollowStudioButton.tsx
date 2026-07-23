"use client";

import {
  Heart,
  LoaderCircle,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FollowStudioButtonProps {
  readonly following: boolean;
  readonly followerCount?: number;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onToggle: () => void | Promise<void>;
}

export function FollowStudioButton({
  className,
  followerCount,
  following,
  loading = false,
  onToggle,
}: FollowStudioButtonProps): React.JSX.Element {
  return (
    <Button
      variant={
        following
          ? "outline"
          : "primary"
      }
      disabled={loading}
      aria-pressed={following}
      className={cn(
        following &&
          "border-[var(--color-gold-500)] bg-[var(--color-gold-100)] text-[var(--color-gold-600)]",
        className
      )}
      onClick={() => {
        void onToggle();
      }}
    >
      {loading ? (
        <LoaderCircle
          aria-hidden={true}
          className="size-4 animate-spin"
        />
      ) : (
        <Heart
          aria-hidden={true}
          className={cn(
            "size-4",
            following &&
              "fill-current"
          )}
        />
      )}

      {following
        ? "Following Studio"
        : "Follow Studio"}

      {typeof followerCount ===
      "number" ? (
        <span className="rounded-full bg-background px-2 py-0.5 text-xs">
          {followerCount.toLocaleString(
            "en-IN"
          )}
        </span>
      ) : null}
    </Button>
  );
}
