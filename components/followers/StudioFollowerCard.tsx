"use client";

import {
  Mail,
  UserRound,
} from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/date";

export interface StudioFollower {
  readonly id: string;
  readonly userId: string;
  readonly displayName: string;
  readonly email?: string;
  readonly photoURL?: string | null;
  readonly orderCount: number;
  readonly followedAt: string;
  readonly customerSince?: string;
}

interface StudioFollowerCardProps {
  readonly follower: StudioFollower;
  readonly onSelect?: (
    follower: StudioFollower
  ) => void;
}

export function StudioFollowerCard({
  follower,
  onSelect,
}: StudioFollowerCardProps): React.JSX.Element {
  const content = (
    <>
      <Avatar
        name={follower.displayName}
        src={follower.photoURL}
        size="md"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="truncate font-medium text-foreground">
            {follower.displayName}
          </h3>

          {follower.orderCount >
          0 ? (
            <Badge variant="success">
              Collector
            </Badge>
          ) : (
            <Badge variant="neutral">
              Follower
            </Badge>
          )}
        </div>

        {follower.email ? (
          <p className="mt-2 inline-flex items-center gap-2 truncate text-xs text-muted">
            <Mail
              aria-hidden="true"
              className="size-3.5"
            />
            {follower.email}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
          <span>
            Following since{" "}
            {formatDate(
              follower.followedAt
            )}
          </span>

          <span>
            {follower.orderCount.toLocaleString(
              "en-IN"
            )}{" "}
            {follower.orderCount === 1
              ? "order"
              : "orders"}
          </span>
        </div>
      </div>

      <UserRound
        aria-hidden="true"
        className="size-4 shrink-0 text-[var(--color-gold-600)]"
      />
    </>
  );

  return (
    <Card className="p-5">
      {onSelect ? (
        <button
          type="button"
          className="flex w-full items-start gap-4 text-left"
          onClick={() =>
            onSelect(follower)
          }
        >
          {content}
        </button>
      ) : (
        <div className="flex items-start gap-4">
          {content}
        </div>
      )}
    </Card>
  );
}
