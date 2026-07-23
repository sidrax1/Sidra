import type {
  ReactNode,
} from "react";

import {
  StudioFollowerCard,
  type StudioFollower,
} from "@/components/followers/StudioFollowerCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface StudioFollowerListProps {
  readonly followers: readonly StudioFollower[];
  readonly emptyAction?: ReactNode;
  readonly onSelect?: (
    follower: StudioFollower
  ) => void;
}

export function StudioFollowerList({
  emptyAction,
  followers,
  onSelect,
}: StudioFollowerListProps): React.JSX.Element {
  if (followers.length === 0) {
    return (
      <EmptyState
        title="No studio followers yet"
        description="Collectors who choose to follow this Studio will appear here."
        action={emptyAction}
      />
    );
  }

  return (
    <section
      aria-label="Studio followers"
      className="grid gap-4"
    >
      {followers.map(
        (follower) => (
          <StudioFollowerCard
            key={follower.id}
            follower={follower}
            onSelect={onSelect}
          />
        )
      )}
    </section>
  );
}
